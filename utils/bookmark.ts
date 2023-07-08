import { Bookmark, BookmarkSort, BookmarkType } from 'types/bookmark';
import { Destination, Journey } from 'types/journey';
import {
  IconBinaryTree,
  IconBook,
  IconCodeDots,
  IconFlag,
  IconNotes,
  IconSchool,
  IconVideo,
  TablerIconsProps,
} from '@tabler/icons-react';

import { produce } from 'immer';
import { useNodeStore } from 'store/node';

export const bookmarkTypes: BookmarkType[] = ['journey', 'destination', 'article', 'book', 'course', 'video', 'misc'];

export function getLabel(bookmark: Bookmark): string {
  switch (bookmark.type) {
    case 'destination':
      return bookmark.jnode.title;
    case 'journey':
      return bookmark.journey.prompt.label;
    case 'article':
      return bookmark.article.title;
    case 'book':
      return bookmark.book.title;
    case 'course':
      return bookmark.course.title;
    case 'misc':
      return bookmark.misc.title;
    case 'video':
      return bookmark.video.title;
  }
}

export function getSubtitle(bookmark: Bookmark): string {
  switch (bookmark.type) {
    case 'destination':
      return `${bookmark.jnode.resources} ${bookmark.jnode.resources === 1 ? 'resource' : 'resources'}`;
    case 'journey':
      return bookmark.journey.destinations.map((d) => useNodeStore.getState().jnodes.get(d.id)?.title ?? '').join(', ');
    case 'article':
      return bookmark.article.url;
    case 'book':
      return bookmark.book.url;
    case 'course':
      return bookmark.course.url;
    case 'misc':
      return bookmark.misc.url;
    case 'video':
      return bookmark.video.url;
  }
}

export function getPrettyType(type: BookmarkType): string {
  switch (type) {
    case 'destination':
      return 'Destination';
    case 'journey':
      return 'Journey';
    case 'article':
      return 'Article';
    case 'book':
      return 'Book';
    case 'course':
      return 'Course';
    case 'misc':
      return 'Miscellaneous';
    case 'video':
      return 'Video';
  }
}

export function getIcon(type: BookmarkType): (props: TablerIconsProps) => JSX.Element {
  switch (type) {
    case 'destination':
      return IconFlag;
    case 'journey':
      return IconBinaryTree;
    case 'article':
      return IconNotes;
    case 'book':
      return IconBook;
    case 'course':
      return IconSchool;
    case 'misc':
      return IconCodeDots;
    case 'video':
      return IconVideo;
  }
}

export function getAction(type: BookmarkType): string {
  switch (type) {
    case 'destination':
      return 'Visit destination';
    case 'journey':
      return 'Embark on journey';
    case 'article':
    case 'book':
    case 'course':
    case 'misc':
    case 'video':
      return 'Open in new tab';
  }
}

export function getUrl(bookmark: Bookmark): string | null {
  switch (bookmark.type) {
    case 'destination':
    case 'journey':
      return null;
    case 'article':
      return bookmark.article.url;
    case 'book':
      return bookmark.book.url;
    case 'course':
      return bookmark.course.url;
    case 'misc':
      return bookmark.misc.url;
    case 'video':
      return bookmark.video.url;
  }
}

export function generateId(destinations: Destination[]): string {
  const sorted = produce(destinations, (draft) => draft.sort());
  return sorted.join('-');
}

export function getPrettySort(sort: BookmarkSort): string {
  switch (sort) {
    case 'asc':
      return 'Ascending';
    case 'desc':
      return 'Descending';
    case 'none':
      return 'None';
  }
}

type BookmarkActionParams = {
  bookmark: Bookmark;
  window: Window & typeof globalThis;
  updateNodes: (destinations: Destination[]) => void;
  setSelected: (journey: Journey | null) => void;
};

export function actionHandler(params: BookmarkActionParams): void {
  const { bookmark, window, updateNodes, setSelected } = params;
  switch (bookmark.type) {
    case 'article':
      window.open(bookmark.article.url, '_blank', 'noreferrer');
      break;
    case 'book':
      window.open(bookmark.book.url, '_blank', 'noreferrer');
      break;
    case 'course':
      window.open(bookmark.course.url, '_blank', 'noreferrer');
      break;
    case 'misc':
      window.open(bookmark.misc.url, '_blank', 'noreferrer');
      break;
    case 'video':
      window.open(bookmark.video.url, '_blank', 'noreferrer');
      break;
    case 'destination':
      updateNodes([{ id: bookmark.jnode.id, enabled: true }]);
      setSelected(null);
      break;
    case 'journey':
      updateNodes(bookmark.journey.destinations);
      break;
  }
}
