import {Link} from "./ILink";
import {Image} from "./IImage";

export interface ExperienceItem {
  role: string;
  company: string;
  link: Link;
  image: Image;
  location: string;
  dates: string[];
  description: string;
}
