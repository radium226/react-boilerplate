import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createHashHistory from 'history/lib/createHashHistory';

export const HistoryStrategy = {
  MEMORY: 'memory',
  HASH: 'hash',
  BROWSER: 'browser',
};

export default function createHistory(historyStrategy) {
  switch (historyStrategy) {
    case HistoryStrategy.MEMORY:
      return createMemoryHistory();

    case HistoryStrategy.HASH:
      return createHashHistory();

    case HistoryStrategy.BROWSER:
      return createBrowserHistory();
  }
}
