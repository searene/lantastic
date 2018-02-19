import {BaseInput} from "./BaseInput";

import {Sqlite} from '../Sqlite';
import '../stylesheets/components/CardBrowser.scss';
import * as React from 'react';
import {RootState} from "../reducers";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Segment, Table, Pagination, PaginationProps} from 'semantic-ui-react';
import {BaseButton} from "./BaseButton";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME, CARD_TABLE, DATE_FORMAT
} from "../Constants";
import moment = require("moment");
import {actions} from "../actions";

interface CardBrowserProps {
}

interface CardBrowserStates {
  pageNum: number;
  searchInputValue: string;
  cards: any[];
  activePage: number;
  orderBy: string;
  isOrderByAscending: boolean;
  isLoaded: boolean;
}

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);


const PAGE_SIZE = 3;
const TABLE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class ConnectedCardBrowser extends React.Component<CardBrowserProps, CardBrowserStates> {

  constructor(props: CardBrowserProps) {
    super(props);
    this.state = {
      cards: [],
      pageNum: 0,
      searchInputValue: '',
      activePage: 1,
      orderBy: CARD_COLUMN_DECK,
      isOrderByAscending: true,
      isLoaded: false,
    };
  }
  async componentWillMount() {
    this.setState({
      cards: await this.getCards(this.state.activePage),
      pageNum: await this.getPageNum(),
      isLoaded: true,
    });
  }

  render() {
    return (
      <Segment className={"card-browser-segment"}>
        {this.state.isLoaded ?
          [<div className={"search-row"} key={"search-row"}>
            <BaseInput
              placeholder={"Search cards..."}
              value={this.state.searchInputValue}
              onChange={(evt) => this.setState({searchInputValue: (evt.target as HTMLInputElement).value})}
            />
            <BaseButton onClick={() => this.search(0)}>Search</BaseButton>
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
            <Pagination
              activePage={this.state.activePage}
              totalPages={this.state.pageNum}
              onPageChange={this.handleClickOnPagination}/>
          </div>
          ]
          : <div/>}
      </Segment>
    )
  }

  // page starts with 1
  private search = async (pageNo: number): Promise<void> => {
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
                   ${this.getPageLimitStatement(pageNo)}
    `, [param, param, param]);
    this.setState({
      cards: results
    });
  };
  private getCards = async (pageNo: number): Promise<any[]> => {
    const db = await Sqlite.getDb();
    return await db.all(`
                     SELECT
                        ${CARD_COLUMN_ID},
                        ${CARD_COLUMN_DECK},
                        ${CARD_COLUMN_NEXT_REVIEW_TIME},
                        ${CARD_COLUMN_CREATION_TIME},
                        ${CARD_COLUMN_FRONT},
                        ${CARD_COLUMN_BACK}
                     FROM ${CARD_TABLE}
                     ${this.getOrderByStatement()}
                     ${this.getPageLimitStatement(pageNo)}
      `);
  };
  private getOrderByStatement = () => {
    return `ORDER BY ${this.state.orderBy} ${this.state.isOrderByAscending ? "ASC" : "DESC"}`;
  };
  private getPageLimitStatement = (pageNo: number): string => {
    return `LIMIT ${PAGE_SIZE * (pageNo - 1)}, ${PAGE_SIZE * pageNo}`;
  };
  private getPageNum = async (): Promise<number> => {
    const db = await Sqlite.getDb();
    const result = await db.get(`
                    SELECT COUNT(*) AS count
                    FROM ${CARD_TABLE}
    `);
    return Math.ceil(result.count / PAGE_SIZE);
  };
  private handleClickOnPagination = async (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const pageNo = data.activePage as number;
    const cards = await this.getCards(pageNo);
    this.setState({
      cards: cards,
      activePage: pageNo,
    });
  };
}

export const CardBrowser = connect(mapStateToProps, mapDispatchToProps)(ConnectedCardBrowser);
