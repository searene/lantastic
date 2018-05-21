export interface Card {
  id: number;
  deck: string;
  front: string;
  back: string;
  creation_time: number;
  next_review_time: number;
  previous_review_time_list: string;
}
