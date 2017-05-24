import { ObservableTestPage } from './app.po';

describe('observable-test App', () => {
  let page: ObservableTestPage;

  beforeEach(() => {
    page = new ObservableTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
