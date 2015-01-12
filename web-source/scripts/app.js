class View {
  constructor() {
    this.hello = 'poo';
  }
}


class AppView extends View {
  constructor() {
    this.hello = 'world';
  }
}

export default AppView;