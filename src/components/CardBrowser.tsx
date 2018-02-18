import {BaseInput} from "./BaseInput";

import {Sqlite} from '../Sqlite';
import '../stylesheets/components/CardBrowser.scss';
import * as React from 'react';
import {RootState} from "../reducers";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Segment, Table, Pagination} from 'semantic-ui-react';
import {BaseButton} from "./BaseButton";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME, CARD_TABLE, DATE_FORMAT
} from "../Constants";
import moment = require("moment");
import {actions} from "../actions";

interface CardBrowserProps {
  isCardBrowserLoaded: boolean;
  setCardBrowserLoaded: (isCardBrowserLoaded: boolean) => any;
}

interface CardBrowserStates {
  pageNum: number;
  searchInputValue: string;
  cards: any[];
  currentPage: number;
  orderBy: string;
  isOrderByAscending: boolean;
}

const mapStateToProps = (state: RootState) => ({
  isCardBrowserLoaded: state.isCardBrowserLoaded,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setCardBrowserLoaded: actions.setCardBrowserLoaded,
}, dispatch);


const PAGE_SIZE = 25;
const TABLE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class ConnectedCardBrowser extends React.Component<CardBrowserProps, CardBrowserStates> {

  constructor(props: CardBrowserProps) {
    super(props);
    this.state = {
      cards: [],
      pageNum: 0,
      searchInputValue: '',
      currentPage: 1,
      orderBy: CARD_COLUMN_DECK,
      isOrderByAscending: true,
    };
  }

  async componentWillMount() {
    if (!this.props.isCardBrowserLoaded) {
      await this.reloadData();
    }
  }

  async componentWillUpdate() {
    if(!this.props.isCardBrowserLoaded) {
      await this.reloadData();
    }
  }

  render() {
    return (
      <Segment className={"card-browser-segment"}>
        {this.props.isCardBrowserLoaded ?
          [<div className={"search-row"} key={"search-row"}>
            <BaseInput
              placeholder={"Search cards..."}
              value={this.state.searchInputValue}
              onChange={(evt) => this.setState({searchInputValue: (evt.target as HTMLInputElement).value})}
            />
            <BaseButton onClick={() => this.search()}>Search</BaseButton>
          </div>,
          <div className={"table-body-row"} key={"table-body-row"}>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Deck</Table.HeaderCell>
                  <Table.HeaderCell>Front</Table.HeaderCell>
                  <Table.HeaderCell>Back</Table.HeaderCell>
                  <Table.HeaderCell>Creation Time</Table.HeaderCell>
                  <Table.HeaderCell>Next Review Time</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.cards.map(card => (
                  <Table.Row key={card[CARD_COLUMN_ID]}>
                    <Table.Cell>{card[CARD_COLUMN_DECK]}</Table.Cell>
                    <Table.Cell>{card[CARD_COLUMN_FRONT]}</Table.Cell>
                    <Table.Cell>{card[CARD_COLUMN_BACK]}</Table.Cell>
                    <Table.Cell>{moment(card[CARD_COLUMN_CREATION_TIME], DATE_FORMAT).format(TABLE_DATE_FORMAT)}</Table.Cell>
                    <Table.Cell>{moment(card[CARD_COLUMN_NEXT_REVIEW_TIME], DATE_FORMAT).format(TABLE_DATE_FORMAT)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>,

          <div className={'pagination-row'} key={'pagination-row'}>
            <Pagination defaultActivePage={5} totalPages={this.state.pageNum}/>
          </div>
          ]
          : <div/>}
      </Segment>
    )
  }

  // page starts with 1
  private search = async (): Promise<void> => {
    const db = await Sqlite.getDb();
    const param = '%' + this.state.searchInputValue
      .replace(/!/, '!!')
      .replace(/%/, '!!')
      .replace(/_/, '!!')
      .replace(/\[/, '!!') + '%';
    const results = await db.all(`
                   SELECT
                      ${CARD_COLUMN_DECK},
                      ${CARD_COLUMN_NEXT_REVIEW_TIME},
                      ${CARD_COLUMN_CREATION_TIME},
                      ${CARD_COLUMN_FRONT},
                      ${CARD_COLUMN_BACK}
                   FROM ${CARD_TABLE}
                   WHERE ((${CARD_COLUMN_DECK} LIKE ? ESCAPE '!')
                       OR (${CARD_COLUMN_FRONT} LIKE ? ESCAPE '!')
                       OR (${CARD_COLUMN_BACK} LIKE ? ESCAPE '!'))
                   ${this.getOrderByStatement()}
                   ${this.getPageLimitStatement()}
    `, [param, param, param]);
    this.setState({
      cards: results
    });
  };
  private setInitialCards = async (): Promise<void> => {
    const db = await Sqlite.getDb();
    const results = await db.all(`
                     SELECT
                        ${CARD_COLUMN_ID},
                        ${CARD_COLUMN_DECK},
                        ${CARD_COLUMN_NEXT_REVIEW_TIME},
                        ${CARD_COLUMN_CREATION_TIME},
                        ${CARD_COLUMN_FRONT},
                        ${CARD_COLUMN_BACK}
                     FROM ${CARD_TABLE}
                     ${this.getOrderByStatement()}
                     ${this.getPageLimitStatement()}
      `);
    this.setState({
      cards: results
    });
  };
  private getOrderByStatement = () => {
    return `ORDER BY ${this.state.orderBy} ${this.state.isOrderByAscending ? "ASC" : "DESC"}`;
  };
  private getPageLimitStatement = (): string => {
    return `LIMIT ${PAGE_SIZE * (this.state.currentPage - 1)}, ${PAGE_SIZE * this.state.currentPage}`;
  };
  private getPageNum = async (): Promise<number> => {
    const db = await Sqlite.getDb();
    const result = await db.get(`
                    SELECT COUNT(*) AS count
                    FROM ${CARD_TABLE}
    `);
    return Math.ceil(result.count / PAGE_SIZE);
  };
  private reloadData = async () => {
    await this.setInitialCards();
    this.props.setCardBrowserLoaded(true);
    this.setState({
      pageNum: await this.getPageNum(),
    });
  }
}


export const CardBrowser = connect(mapStateToProps, mapDispatchToProps)(ConnectedCardBrowser);
