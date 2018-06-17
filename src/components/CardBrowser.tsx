import { BaseInput } from "./BaseInput";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Pagination, PaginationProps, Segment, Table } from "semantic-ui-react";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME,
  CARD_COLUMN_DECK,
  CARD_COLUMN_FRONT,
  CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_TABLE,
  DATE_FORMAT
} from "../Constants";
import { RootState } from "../reducers";
import { Sqlite } from "../Sqlite";
import "../stylesheets/components/CardBrowser.scss";
import { BaseButton } from "./BaseButton";
import { actions } from "../actions";
import { Card } from "../models/Card";
import { List } from "immutable";
import { CardTable } from "./CardTable";

interface ICardBrowserStates {
  totalPageNum: number;
  searchInputValue: string;
  activePage: number;
  orderBy: string;
  isOrderByAscending: boolean;
  isLoaded: boolean;
  cards: List<Card>;
}

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
    },
    dispatch
  );

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
      cards: List()
    };
  }
  public async componentWillMount() {
    await this.reloadData(1);
  }

  public render() {
    return (
      <Segment className={"card-browser-segment"}>
        {this.state.isLoaded && (
          <div>
            <div className={"search-container"} key={"search-container"}>
              <BaseInput
                placeholder={"Search cards..."}
                value={this.state.searchInputValue}
                onChange={evt => this.setState({ searchInputValue: (evt.target as HTMLInputElement).value })}
                onKeyPress={this.handleInputKeyPress}
              />
              <BaseButton onClick={this.search}>Search</BaseButton>
            </div>
            <CardTable
              cards={this.state.cards}
              onDeleteCard={this.deleteCard}
            />
            <div className={"pagination-row"} key={"pagination-row"}>
              <Pagination
                activePage={this.state.activePage}
                totalPages={this.state.totalPageNum}
                onPageChange={this.handleClickOnPagination}
              />
            </div>
          </div>
        )}
      </Segment>
    );
  }

  private reloadData = async (pageNo: number): Promise<void> => {
    const cards = await this.getCards(pageNo);
    this.setState({ cards: cards });
    const totalPageNum = await this.getTotalPageNum();
    this.setState({
      isLoaded: true,
      totalPageNum
    });
  };

  // page starts with 1
  private search = async (): Promise<void> => {
    await this.reloadData(1);
  };
  private getFilteredKeyWord = (keyWord: string): string => {
    return (
      "%" +
      keyWord
        .replace(/!/, "!!")
        .replace(/%/, "!!")
        .replace(/_/, "!!")
        .replace(/\[/, "!!") +
      "%"
    );
  };
  private getCards = async (pageNo: number): Promise<List<Card>> => {
    const db = await Sqlite.getDb();
    const cards = await db.all(this.getSQL(this.getColumns(), pageNo), this.getSQLParams());
    return List.of(...cards);
  };
  private getSQL = (column: string, pageNo?: number): string => {
    return `
                     SELECT
                        ${column}
                     FROM ${CARD_TABLE}
                     ${this.getWhereClause()}
                     ${this.getOrderByStatement()}
                     ${this.getPageLimitStatement(pageNo)}
    `;
  };
  private getWhereClause = (): string => {
    return this.state.searchInputValue === ""
      ? ""
      : `
                     WHERE ((${CARD_COLUMN_DECK} LIKE ? ESCAPE '!')
                         OR (${CARD_COLUMN_FRONT} LIKE ? ESCAPE '!')
                         OR (${CARD_COLUMN_BACK} LIKE ? ESCAPE '!'))
    `;
  };
  private getSQLParams = () => {
    const keyWord = this.getFilteredKeyWord(this.state.searchInputValue);
    return this.state.searchInputValue === "" ? [] : [keyWord, keyWord, keyWord];
  };
  private getColumns = () => {
    return `
                        ${CARD_COLUMN_ID},
                        ${CARD_COLUMN_DECK},
                        ${CARD_COLUMN_NEXT_REVIEW_TIME},
                        ${CARD_COLUMN_CREATION_TIME},
                        ${CARD_COLUMN_FRONT},
                        ${CARD_COLUMN_BACK}
    `;
  };
  private getOrderByStatement = () => {
    return `ORDER BY ${this.state.orderBy} ${this.state.isOrderByAscending ? "ASC" : "DESC"}`;
  };
  private getPageLimitStatement = (pageNo: number): string => {
    if (pageNo === undefined) {
      return "";
    }
    return `LIMIT ${PAGE_SIZE * (pageNo - 1)}, ${PAGE_SIZE * pageNo}`;
  };
  private getTotalPageNum = async (): Promise<number> => {
    const db = await Sqlite.getDb();
    const sql = this.getSQL("COUNT(*) as count");
    const params = this.getSQLParams();
    const result = await db.get(sql, params);
    return Math.ceil(result.count / PAGE_SIZE);
  };
  private handleClickOnPagination = async (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    const pageNo = data.activePage as number;
    const cards = await this.getCards(pageNo);
    this.setState({ cards: cards });
    this.setState({
      activePage: pageNo
    });
  };
  private handleInputKeyPress = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      await this.search();
    }
  };
  private deleteCard = async (cardId: number, callback: (success: boolean) => void) => {
    await Sqlite.deleteCard(cardId);
    this.setState({
      cards: this.state.cards.filter(card => card.id !== cardId).toList()
    })
    callback(true);
  }
}

export const CardBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalCardBrowser);
