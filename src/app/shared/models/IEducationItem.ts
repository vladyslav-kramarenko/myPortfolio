import {Link} from "./ILink";

export interface EducationItem {
  degree: string;
  degreeLink: Link;
  university: string;
  location: string;
  dates: string;
  description: string[];
}
