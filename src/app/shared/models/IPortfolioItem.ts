import {Link} from "./ILink";

export interface PortfolioItem {
  id: string;
  filter: string;
  links: Link[];
  description: string;
  img: string;
  alt: string;
  tags: string[];
}
