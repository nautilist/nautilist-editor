!function(){var s=["1a7e047ed9799150/bundle.js","328761907cb7cf43/bundle.css","assets/1F308.png","assets/1F33C.png","assets/1F3D3.png","assets/1F490.png","assets/1F4A5.png","assets/1F4DD.png","assets/1F50E.png","assets/1F517.png","assets/1F984.png","assets/2728.png","assets/2764.png","assets/BEAR-1F43B.png","assets/CHICKEN-1F414.png","assets/COW-1F42E.png","assets/DOG-1F436.png","assets/F0002.png","assets/F000A.png","assets/FROG-1F438.png","assets/HAMSTER-1F439.png","assets/MOUSE-1F42D.png","assets/MONKEY-1F435.png","assets/PANDA-1F43C.png","assets/WOLF-1F43A.png","assets/PIG-1F437.png","assets/TIGER-1F42F.png","assets/icon.png","assets/logo-wow.png","assets/nautilists-header.png","assets/nautilists-logo-2.png","assets/web-editor.png","manifest.json"];self.addEventListener("fetch",function(s){s.respondWith(self.caches.match(s.request).then(function(e){return e||self.fetch(s.request)}))}),self.addEventListener("install",function(e){e.waitUntil(self.caches.open("1.0.0").then(function(e){return e.addAll(s)}))}),self.addEventListener("activate",function(s){s.waitUntil(self.caches.keys().then(function(s){return Promise.all(s.map(function(e,n){if("1.0.0"!==s[n])return self.caches.delete(s[n])}))}))})}();
//# sourceMappingURL=bankai-service-worker.js.map