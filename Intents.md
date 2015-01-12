```js
// mb-const.js
module.exports = {
  ROUTE: 'ROUTE'
};

// message-box.js
var MB = require('./mb-const.js');
var parseHash = function(hash) {
  var blocks = _.chain(hash).split('/').unique().value();
  if (!blocks.length) { return ['']; }
  return blocks;
};


var Box = new Treaty.MessageBox({
  setup: function() {
    this.config(MB.ROUTE, {
      transform: function(data) {
        data.frags = parseHash(data.hash);
        data.section = data.frags[0];
        data.id = data.frags[1] || '';
        return data;
      }
    });
  }
});

// server-payload.js
//   server can kick start static
//   html with payload data
var MB = require('./mb-const.js');
var Box = require('./message-box.js');

Box.update(MB.ROUTE, {
    hash: 'portfolio/ca-portfolio'
}, { payload: true }); 


// main.js
var StumpApp = require('./app.js');
Treaty.register('STB', new StumpApp('#application'));

$(window).on('hashchange', function(ev) {
  Box.update(MB.ROUTE, { hash: ev.hash });
});


// app.js
var MB = require('./mb-const.js');
var Box = require('./message-box.js');
var PortfolioComponent = require('./portfolio.js');

var isHome = function(data) { return _.contains(['', 'home'], hash[0]); };
var isPortfolio = function(data) { return hash[0] === 'portfolio'; };
var isCode = function(data) { return hash[0] === 'code'; };
var isBlog = function(data) { return hash[0] === 'blog'; };
var isUnknown = Kondico.nor(isHome, isPortfolio, isCode, isBlog);

module.exports = Treaty.Component.extend({
  template: Treaty.Template('application'),

  ui: {
    $wrapper: '.l-app',
    $container: '.l-app-container'
  },

  setup: function() {
    this.setupState(isHome, HomeComponent);
    this.setupState(isPortfolio, PortfolioComponent);
    this.setupState(isCode, CodeComponent);
    this.setupState(isBlog, BlogComponent);
    this.setupState(isUnknown, UnknownSectionComponent);
  },

  setupState: function(state, Component) {    
    this.state(EV.ROUTE).enter(state, function() {
      comp.section = new Component(comp.$container);
    }).exit(state, function() {
      comp.section.destroy();
    });
  },

  cleanup: function() {
    if (this.section) {
      this.section.destroy();
    }
  }
});


//portfolio.js
var isIndex = Kondico(function(data, msg) {
    return _.contains(['', 'index'], data.frag[1]);
});

var isPage = Kondico.not(isIndex);
var isUnknown = Kondico.nor(isIndex, isUnknown);
var isError = Kondico.or(isUnknown, function(data) {
    return data.section === undefined;
});

module.exports = Treaty.Component.extend({
  template: Treaty.template('portfolio'),

  ui: {
    $container: '.l-portfolio-container'
  },

  setup: function() {
    this.state(EV.ROUTE).enter(isIndex, function() {
      comp.section = new PortfolioIndexComponent(comp.$container);
    }).exit(isIndex, function() {
      comp.section.destroy();
    });

    this.state(EV.ROUTE).enter(isIndex, function() {
      comp.section = new PortfolioPageComponent(comp.$container);
    }).exit(isIndex, function() {
      comp.section.destroy();
    });
  },

  cleanup: function() {
    if (this.section) {
      this.section.destroy();
    }
  }
});

//portfolio.store.js
var Store = Treaty.Store.extend({
  box: require('./message-box.js'),
  setup: function() {
    this.state()
  }
})

module.exports = new Store();

//portfolio.page.js
var PortfolioStore = require('./portfolio.store.js');

module.exports = Treaty.Component.extend({
  box: require('./message-box.js'),
  store: require('./portfolio.store.js'),
  template: Treaty.template('portfolio.page'),
  
  ui: {
    $wrapper: '.l-portfolio',
    $container: '.l-portfolio-container'
  },

  setup: function() {
    this.store.change('')
  },

  cleanup: function() {
  }
});
```