describe('Update the HTML document', () => {

  const Constants = asciidoctor.browser.constants();
  const Dom = asciidoctor.browser.dom(document);
  const Theme = asciidoctor.browser.theme(browser, Constants);
  const Settings = asciidoctor.browser.settings(browser, Constants);
  const Renderer = asciidoctor.browser.renderer(browser, document, Constants, Settings, Dom, Theme);

  it('should update the HTML document with the AsciiDoc source', (done) => {
    // Given
    const source = '= Hello world';
    spyOn(browser.storage.local, 'set').and.callFake(() => {
      // noop
    });
    spyOn(browser.storage.local, 'get').and.callFake((name, callback) => {
      const values = [];
      values[Constants.CUSTOM_ATTRIBUTES_KEY] = '';
      values[Constants.SAFE_MODE_KEY] = 'safe';
      callback(values);
    });
    spyOn(browser.runtime, 'getManifest').and.callFake(() => {
      return {
        web_accessible_resources: [
          "css/themes/asciidoctor.css",
          "css/themes/colony.css",
          "css/themes/foundation.css",
          "css/themes/foundation-lime.css",
          "css/themes/foundation-potion.css",
          "css/themes/github.css",
          "css/themes/golo.css",
          "css/themes/iconic.css",
          "css/themes/maker.css",
          "css/themes/readthedocs.css",
          "css/themes/riak.css",
          "css/themes/rocket-panda.css",
          "css/themes/rubygems.css",
        ]
      }
    });
    // When
    Renderer.update(source)
      .then(() => {
        // Chartist must be present
        expect(document.getElementById('asciidoctor-browser-chartist-style').getAttribute('href')).toBe('css/chartist.min.css');
        expect(document.getElementById('asciidoctor-browser-chartist-default-style').innerText).not.toBe('');
        // Default Asciidoctor stylesheet must be present
        expect(document.getElementById('asciidoctor-browser-style').getAttribute('href')).toBe('css/themes/asciidoctor.css');
        // Font Awesome must be present
        expect(document.getElementById('asciidoctor-browser-font-awesome-style').getAttribute('href')).toBe('css/font-awesome.min.css');
        // Content must be converted
        expect(document.getElementById('content').innerHTML).toContain('<h1>Hello world</h1>');
        done();
      });
  });


  it('should hide the document title when noheader attribute is defined', (done) => {
    // Given
    const source = `= Hello world
:noheader:

When the noheader attribute is defined, the title must not be shown.
`;
    spyOn(browser.storage.local, 'set').and.callFake(() => {
      // noop
    });
    spyOn(browser.storage.local, 'get').and.callFake((name, callback) => {
      const values = [];
      values[Constants.CUSTOM_ATTRIBUTES_KEY] = '';
      values[Constants.SAFE_MODE_KEY] = 'safe';
      callback(values);
    });
    // When
    Renderer.update(source)
      .then(() => {
        // the document title element <h1> must not be shown
        expect(Array.from(document.getElementsByTagName('h1')).length).toBe(0);
        done();
      });
  });


  it('should show the document title by default', (done) => {
    // Given
    const source = `= Hello world

By default, the title must be shown.
`;
    spyOn(browser.storage.local, 'set').and.callFake(() => {
      // noop
    });
    spyOn(browser.storage.local, 'get').and.callFake((name, callback) => {
      const values = [];
      values[Constants.CUSTOM_ATTRIBUTES_KEY] = '';
      values[Constants.SAFE_MODE_KEY] = 'safe';
      callback(values);
    });
    // When
    Renderer.update(source)
      .then(() => {
        // the document title element <h1> must be shown
        expect(Array.from(document.getElementsByTagName('h1'))[0].innerText).toBe('Hello world');
        done();
      });
  });
});
