import {Link} from "./ILink";
import {Image} from "./IImage";

export interface PortfolioItem {
  id: string;
  filter: string;
  links: Link[];
  description: string;
  mainImg: Image;
  images: Image[];
  title: string;
  tags: string[];
}
