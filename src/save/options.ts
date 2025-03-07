import defaultMainStyleText from "./main.css";
import defaultTocStyleText from "./toc.css";
import { Chapter } from "../main/Chapter";
import { fullWidthLength } from "../lib/dom";
import { Book } from "../main/Book";

class Common {
  public genMetaDateTxt(book: Book) {
    let metaDateText = `${book.bookname}\n作者：${book.author}`;
    metaDateText += '\n来源：未知'
    if (book.introduction) {
      metaDateText += `\n简介：\n${book.introduction}`;
    }
    metaDateText += `\n\n\n\n\n`;
    return metaDateText;
  }

  public getChapterNumberToSave(chapter: Chapter, chapters: Chapter[]) {
    return `${"0".repeat(
      Math.max(chapters.length.toString().length, 5) -
        Math.trunc(chapter.chapterNumber).toString().length
    )}${chapter.chapterNumber.toString()}`;
  }
}

export interface SaveOptions {
  mainStyleText?: string;
  tocStyleText?: string;
  getchapterName?: Options["getchapterName"];
  genSectionText?: Options["genSectionText"];
  genChapterText?: Options["genChapterText"];
  chapterSort?: Options["chapterSort"];
}

export function saveOptionsValidate(data: any) {
  const keyNamesS: (keyof SaveOptions)[] = ["mainStyleText", "tocStyleText"];
  const keyNamesF: (keyof SaveOptions)[] = [
    "getchapterName",
    "genSectionText",
    "genChapterText",
    "chapterSort",
  ];

  function keyNametest(keyname: string) {
    const keyList: string[] = [...keyNamesS, ...keyNamesF];
    return keyList.includes(keyname);
  }

  function keyNamesStest(keyname: string) {
    if (keyNamesS.includes(keyname as keyof SaveOptions)) {
      if (typeof data[keyname] === "string") {
        return true;
      }
    }
    return false;
  }

  function keyNamesFtest(keyname: string) {
    if (keyNamesF.includes(keyname as keyof SaveOptions)) {
      if (typeof data[keyname] === "function") {
        return true;
      }
    }
    return false;
  }

  if (typeof data !== "object") {
    return false;
  }
  if (Object.keys(data).length === 0) {
    return false;
  }
  for (const keyname in data) {
    if (Object.prototype.hasOwnProperty.call(data, keyname)) {
      if (!keyNametest(keyname)) {
        return false;
      }
      if (!(keyNamesStest(keyname) || keyNamesFtest(keyname))) {
        return false;
      }
    }
  }
  return true;
}

export class Options extends Common {
  public mainStyleText = defaultMainStyleText;
  public tocStyleText = defaultTocStyleText;

  public getchapterName(chapter: Chapter) {
    if (chapter.chapterName) {
      return chapter.chapterName;
    } else {
      return chapter.chapterNumber.toString();
    }
  }

  public genSectionText(sectionName: string) {
    return (
      `${sectionName}`
    );
  }

  public genChapterText(sectionName: string, chapterName: string, contentText: string) {
    contentText = contentText
    .split("\n")
    .map((line) => {
      if (line.trim() === "") {
        return line;
      } else {
        return line.replace(/^/, "　　");
      }
    })
    .join("\n");
    contentText = contentText.replaceAll("\n\n", "\n");
    return `${sectionName} : ${chapterName}\n\n${contentText}\n\n\n`;
  }

  public chapterSort(a: Chapter, b: Chapter) {
    return a.chapterNumber - b.chapterNumber;
  }
}
