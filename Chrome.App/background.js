chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.chrome.html', {
    'bounds': {
      'width': 640,
      'height': 410
    }
  });
});