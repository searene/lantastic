import {BaseInput} from "./BaseInput";

import moment = require("moment");
import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import { Pagination, PaginationProps, Segment, Table } from "semantic-ui-react";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME, CARD_TABLE, DATE_FORMAT,
} from "../Constants";
import {RootState} from "../reducers";
import {Sqlite} from "../Sqlite";
import "../stylesheets/components/CardBrowser.scss";
import {BaseButton} from "./BaseButton";
import { CardModal } from "./CardModal";
import { actions } from "../actions";
import { Card } from "../models/Card";
import { List } from "immutable";

interface ICardBrowserStates {
  totalPageNum: number;
  searchInputValue: string;
  activePage: number;
  orderBy: string;
  isOrderByAscending: boolean;
  isLoaded: boolean;
}

const mapStateToProps = (state: RootState) => ({
  cardsInCardBrowser: state.cardsInCardBrowser,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setCardModalOpen: (cardModalOpen: boolean) => dispatch(actions.setCardModalOpen(cardModalOpen)),
  setCardInCardModal: (cardInCardModal: Card) => dispatch(actions.setCardInCardModal(cardInCardModal)),
  setCardsInCardBrowser: (cardsInCardBrowser: List<Card>) =>
    dispatch(actions.setCardsInCardBrowser(cardsInCardBrowser)),
}, dispatch);

type CardBrowserProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PAGE_SIZE = 10;
const TABLE_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

class InternalCardBrowser extends React.Component<CardBrowserProps, ICardBrowserStates> {

  constructor(props: CardBrowserProps) {
    super(props);
    this.state = {
      activePage: 1,
      isLoaded: false,
      isOrderByAscending: true,
      orderBy: CARD_COLUMN_DECK,
      searchInputValue: "",
      totalPageNum: 1,
    };
  }
  public async componentWillMount() {
    await this.reloadData(1);
  }

  public render() {
    return (
      <Segment className={"card-browser-segment"}>
        {this.state.isLoaded ?
          [<div className={"search-container"} key={"search-container"}>
            <BaseInput
              placeholder={"Search cards..."}
              value={this.state.searchInputValue}
              onChange={(evt) => this.setState({searchInputValue: (evt.target as HTMLInputElement).value})}
              onKeyPress={this.handleInputKeyPress}
            />
            <BaseButton onClick={this.search}>Search</BaseButton>
          </div>,
          <div className={"table-container"} key={"table-container"}>
            <CardModal/>
            <Table celled selectable striped sortable fixed>
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
                {this.props.cardsInCardBrowser.map((card) => (
                  <Table.Row key={card[CARD_COLUMN_ID]}
                             className={"search-table-row"}
                             onClick={() => this.handleClickOnTableRow(card)}>
                    <Table.Cell>{card[CARD_COLUMN_DECK]}</Table.Cell>
                    <Table.Cell>{card[CARD_COLUMN_FRONT]}</Table.Cell>
                    <Table.Cell>{card[CARD_COLUMN_BACK]}</Table.Cell>
                    <Table.Cell>
                      {moment(card[CARD_COLUMN_CREATION_TIME], DATE_FORMAT).format(TABLE_DATE_FORMAT)}
                    </Table.Cell>
                    <Table.Cell>
                      {moment(card[CARD_COLUMN_NEXT_REVIEW_TIME], DATE_FORMAT).format(TABLE_DATE_FORMAT)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>,

          <div className={"pagination-row"} key={"pagination-row"}>
            <Pagination
              activePage={this.state.activePage}
              totalPages={this.state.totalPageNum}
              onPageChange={this.handleClickOnPagination}/>
          </div>,
          ]
          : <div/>}
      </Segment>
    );
  }

  private reloadData = async (pageNo: number): Promise<void> => {
    this.props.setCardsInCardBrowser(await this.getCards(pageNo));
    const totalPageNum = await this.getTotalPageNum();
    this.setState({
      isLoaded: true,
      totalPageNum,
    });
  }

  // page starts with 1
  private search = async (): Promise<void> => {
    await this.reloadData(1);
  }
  private getFilteredKeyWord = (keyWord: string): string => {
    return "%" + keyWord
      .replace(/!/, "!!")
      .replace(/%/, "!!")
      .replace(/_/, "!!")
      .replace(/\[/, "!!") + "%";
  }
  private getCards = async (pageNo: number): Promise<List<Card>> => {
    const db = await Sqlite.getDb();
    const cards = await db.all(this.getSQL(this.getColumns(), pageNo), this.getSQLParams());
    return List.of(...cards);
  }
  private getSQL = (column: string, pageNo?: number): string => {
    return `
                     SELECT
                        ${column}
                     FROM ${CARD_TABLE}
                     ${this.getWhereClause()}
                     ${this.getOrderByStatement()}
                     ${this.getPageLimitStatement(pageNo)}
    `;
  }
  private getWhereClause = (): string => {
    return this.state.searchInputValue === "" ? "" : `
                     WHERE ((${CARD_COLUMN_DECK} LIKE ? ESCAPE '!')
                         OR (${CARD_COLUMN_FRONT} LIKE ? ESCAPE '!')
                         OR (${CARD_COLUMN_BACK} LIKE ? ESCAPE '!'))
    `;
  }
  private getSQLParams = () => {
    const keyWord = this.getFilteredKeyWord(this.state.searchInputValue);
    return this.state.searchInputValue === "" ? [] : [keyWord, keyWord, keyWord];
  }
  private getColumns = () => {
    return `
                        ${CARD_COLUMN_ID},
                        ${CARD_COLUMN_DECK},
                        ${CARD_COLUMN_NEXT_REVIEW_TIME},
                        ${CARD_COLUMN_CREATION_TIME},
                        ${CARD_COLUMN_FRONT},
                        ${CARD_COLUMN_BACK}
    `;
  }
  private getOrderByStatement = () => {
    return `ORDER BY ${this.state.orderBy} ${this.state.isOrderByAscending ? "ASC" : "DESC"}`;
  }
  private getPageLimitStatement = (pageNo: number): string => {
    if (pageNo === undefined) {
      return "";
    }
    return `LIMIT ${PAGE_SIZE * (pageNo - 1)}, ${PAGE_SIZE * pageNo}`;
  }
  private getTotalPageNum = async (): Promise<number> => {
    const db = await Sqlite.getDb();
    const sql = this.getSQL("COUNT(*) as count");
    const params = this.getSQLParams();
    const result = await db.get(sql, params);
    return Math.ceil(result.count / PAGE_SIZE);
  }
  private handleClickOnPagination = async (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const pageNo = data.activePage as number;
    this.props.setCardsInCardBrowser(await this.getCards(pageNo));
    this.setState({
      activePage: pageNo,
    });
  }
  private handleInputKeyPress = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      await this.search();
    }
  }
  private handleClickOnTableRow = (card: Card) => {
    this.props.setCardInCardModal(card);
    this.props.setCardModalOpen(true);
  }
}

export const CardBrowser = connect(mapStateToProps, mapDispatchToProps)(InternalCardBrowser);
