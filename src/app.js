export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      
      { route: 'manage',         name: 'manage',     moduleId: './manage',        nav: true, title: 'Manage Users' }
     
      
    ]);

    this.router = router;
  }
}
