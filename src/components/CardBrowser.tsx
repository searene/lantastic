import {BaseInput} from "./BaseInput";

declare const __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "../Sqlite";

let Sqlite: typeof SqliteType;
if (!__IS_WEB__) {
  Sqlite = require('../Sqlite').Sqlite;
}
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
import {tableCards} from "../MockData";
import moment = require("moment");
import {actions} from "../actions";

interface CardBrowserProps {
  totalCardCount: number;
  setTotalCardCount: (totalCardPages: number) => any;
}

interface CardBrowserStates {
  searchInputValue: string;
  cards: any[];
  currentPage: number;
  orderBy: string;
  isOrderByAscending: boolean;
  initialized: boolean;
}

const mapStateToProps = (state: RootState) => ({
  totalCardCount: state.totalCardCount,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setTotalCardCount: actions.setTotalCardCount,
}, dispatch);


const PAGE_SIZE = 25;
const TABLE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class ConnectedCardBrowser extends React.Component<CardBrowserProps, CardBrowserStates> {

  constructor(props: CardBrowserProps) {
    super(props);
    this.state = {
      cards: [],
      searchInputValue: '',
      currentPage: 0,
      orderBy: CARD_COLUMN_DECK,
      isOrderByAscending: true,
      initialized: false,
    };
  }

  async componentWillMount() {
    if (!this.state.initialized) {
      await this.setInitialCards();
      this.props.setTotalCardCount(await getTotalCardCount());
      this.setState({
        initialized: true,
      });
    }
  }

  render() {
    return (
      <Segment className={"card-browser-segment"}>
        {this.state.initialized ?
          [<div className={"search-row"} key={"search-row"}>
            <BaseInput
              placeholder={"Search cards..."}
              value={this.state.searchInputValue}
              onChange={(evt) => this.setState({searchInputValue: (evt.target as HTMLInputElement).value})}
            />
            <BaseButton onClick={() => this.search()}>Search</BaseButton>
          </div>,
            <div className={"table-body-row"} key={"table-body-row"}>
              {this.state.cards === undefined ? '' : this.getTableBody()}
            </div>,
            <div className={"table-footer-row"} key={"table-footer-row"}>
              {this.getTableFooter()}
            </div>]
          : <div></div>}
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
    let results: any[];
    if (__IS_WEB__) {
      results = tableCards;
    } else {
      const db = await Sqlite.getDb();
      results = await db.all(`
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
    }
    this.setState({
      cards: results
    });
  };
  private getOrderByStatement = () => {
    return `ORDER BY ${this.state.orderBy} ${this.state.isOrderByAscending ? "ASC" : "DESC"}`;
  };
  private getTableBody = () => {
    return (
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
    )
  };
  private getTableFooter = () => {
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='3'>
            <Pagination defaultActivePage={5} totalPages={this.getPageCount(this.props.totalCardCount)} />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    )
  };
  private getPageLimitStatement = (): string => {
    return `LIMIT ${PAGE_SIZE * (this.state.currentPage - 1)}, ${PAGE_SIZE * this.state.currentPage}`;
  };
  private getPageCount = (cardCount: number) => {
    return Math.ceil(cardCount / PAGE_SIZE);
  }
}

// TODO make sure it's called when adding/deleting cards/decks
export const getTotalCardCount = async (): Promise<number> => {
  if(__IS_WEB__) {
    return tableCards.length;
  }
  const db = await Sqlite.getDb();
  const result = await db.get(`
                    SELECT COUNT(*) AS count
                    FROM ${CARD_TABLE}
    `);
  return result.count;
};

export const CardBrowser = connect(mapStateToProps, mapDispatchToProps)(ConnectedCardBrowser);
