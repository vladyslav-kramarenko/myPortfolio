import {Link} from "./ILink";

export interface Course{
  title:string;
  expanded:boolean;
  links: Link[];
}
