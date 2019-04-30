(function() {
  var Cloud, Entity, Scene, Ship, Star,
    splice = [].splice;

  Scene = (function() {
    class Scene {
      constructor(container) {
        this.tick = this.tick.bind(this);
        this.container = container;
        this.entities = [];
        this.h = $(this.container).height();
        this.w = $(this.container).width();
        this.target = {
          x: 100,
          y: 200
        };
      }

      setup() {}

      run() {
        return setInterval(this.tick, 30);
      }

      update() {
        var entity, j, len, radius, ref, results, star, that, x, y, yellow;
        that = this;
        if (Math.random() > .005) {
          x = this.w + (100 * Math.random());
          y = this.h * Math.random();
          radius = 2 * Math.random();
          yellow = 255 * Math.random();
          star = new Star(that, x, y, radius, radius, 'star', yellow);
        }
        if (this.entities.length > 0) {
          ref = this.entities;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            entity = ref[j];
            if (entity) {
              results.push(entity.update());
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }

      tick() {
        return this.update();
      }

    };

    Scene.prototype.scrollTop = 0;

    return Scene;

  }).call(this);

  Entity = (function() {
    class Entity {
      constructor(scene1, x1, y1, w1 = 0, h1 = 0, classname1 = 'entity') {
        var entity;
        this.scene = scene1;
        this.x = x1;
        this.y = y1;
        this.w = w1;
        this.h = h1;
        this.classname = classname1;
        entity = document.createElement('div');
        entity.className += this.classname;
        this.entity = entity;
        this.scene.container.appendChild(entity);
        this.scene.entities.push(this);
        if (this.scene.debug) {
          console.log('added ' + this.classname);
        }
      }

      update() {
        this.dx = this.x + this.vx * this.dirX;
        this.dy = this.y + this.vy * this.dirY;
        this.x = this.dx;
        this.y = this.dy + this.scene.scrollTop;
        return $(this.entity).css({
          'width': this.w + 'px',
          'height': this.h + 'px',
          'top': this.y + 'px',
          'left': this.x + 'px'
        });
      }

      draw() {}

      changeDir(direction = x) {
        if (direction === 'x') {
          return this.dirX = -this.dirX;
        } else if (direction === 'y') {
          return this.dirY = -this.dirY;
        } else {
          return console.log(direction + ' is not a valid direction');
        }
      }

    };

    Entity.prototype.vx = 0;

    Entity.prototype.vy = 0;

    Entity.prototype.dirY = 1;

    Entity.prototype.dirX = 1;

    Entity.prototype.scrollTop = 0;

    return Entity;

  }).call(this);

  Ship = (function() {
    class Ship extends Entity {
      update() {
        var cloudPoss, i, j;
        this.fly();
        super.update();
        cloudPoss = Math.random();
        if (cloudPoss > .3) {
          for (i = j = 0; j <= 3; i = ++j) {
            this.createCloud();
          }
        }
        if (cloudPoss > .7) {
          this.createCloud();
        }
        if (cloudPoss > .9) {
          return this.createCloud();
        }
      }

      fly() {
        if (this.x < this.scene.target.x - 10) {
          this.vx = this.speedX;
        } else if (this.x > this.scene.target.x + 10) {
          this.vx = -this.speedX;
        } else if (this.x >= this.scene.target.x - 10 || this.x <= this.scene.target.x + 10) {
          this.vx = 0;
        }
        if (this.y < this.scene.target.y - 5) {
          return this.vy = this.speedY;
        } else if (this.y > this.scene.target.y + 5) {
          return this.vy = -this.speedY;
        } else if (this.y <= this.scene.target.y + 5 || this.y >= this.scene.target.y - 5) {
          return this.vy = 0;
        }
      }

      chanceOfChangeX(x) {
        var chance;
        chance = 0.001;
        if (x > this.scene.w * .7 || x < this.scene.w * .1) {
          chance = .1;
        }
        if (Math.random() < chance) {
          return true;
        }
        return false;
      }

      chanceOfChangeY(y) {
        var chance;
        chance = 0.05;
        if (y > this.scene.h * .8 || y < this.scene.h * .2) {
          chance = 0.3;
        }
        if (Math.random() < chance) {
          return true;
        }
        return false;
      }

      createCloud() {
        var cloud, opac, radius, y;
        opac = Math.random();
        if (Math.random() > .6) {
          radius = 60 * Math.random();
        } else {
          radius = 40 * Math.random();
        }
        y = this.y + this.h / 4;
        y += 20 * Math.random();
        if (Math.random() > .5) {
          y *= -1;
        }
        return cloud = new Cloud(this.scene, this.x, y, radius, radius, opac);
      }

    };

    Ship.prototype.speedX = 3;

    Ship.prototype.speedY = 3;

    return Ship;

  }).call(this);

  Cloud = (function() {
    class Cloud extends Entity {
      constructor(scene, x, y, w, h, opacity) {
        super(scene, x, y, w, h, 'cloud');
        this.opacity = opacity;
        $(this.entity).css('opacity', this.opacity);
        this.vx = this.vx * Math.random() - 3;
      }

      
      //keep tabs on how many we're creating ...
      //console.log @scene.entities.length
      update() {
        super.update();
        this.opacity -= .004;
        $(this.entity).css('opacity', this.opacity);
        if (this.opacity <= 0) {
          return this.kill();
        }
      }

      kill() {
        var ref, t, that;
        that = this;
        if ((t = this.scene.entities.indexOf(that))) {
          splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
        }
        return $(this.entity).remove();
      }

    };

    Cloud.prototype.vx = -5;

    return Cloud;

  }).call(this);

  Star = (function() {
    class Star extends Entity {
      constructor(scene, x, y, w, h, classname, yellowBy = 0) {
        var blue;
        super(scene, x, y, w, h, 'star');
        this.yellowBy = yellowBy;
        blue = this.yellowBy;
        $(this.entity).css('background', 'rgb(255,255,' + blue + ')');
      }

      update() {
        super.update();
        if (this.x < 0) {
          return this.kill();
        }
      }

      kill() {
        var ref, t, that;
        that = this;
        if ((t = this.scene.entities.indexOf(that))) {
          splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
        }
        return $(this.entity).remove();
      }

    };

    Star.prototype.vx = -10;

    return Star;

  }).call(this);

  $(function() {
    var cont, dScroll, i, j, radius, scene, scenes, scroll_amt, ship, star, title, titleTop, vh, x, y, yellow;
    scenes = [];
    title = $('h1');
    titleTop = title.css('margin-top').split('px')[0];
    vh = $(window).height();
    vh = vh > 500 ? vh : 500;
    if (vh > 700) {
      vh = 700;
    }
    $('#banner').css('height', vh);
    scroll_amt = 0;
    dScroll = 0;
    $('#banner').mousemove(function(e) {
      var mouseX, mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (scenes[0]) {
        return scenes[0].target = {
          x: mouseX - 130,
          y: mouseY - 120
        };
      }
    });
    $('#banner').mouseleave(function() {
      if (scenes[0]) {
        return scenes[0].target = {
          x: 200,
          y: 200
        };
      }
    });
    $(window).on('scroll', function() {
      var entity, j, len, opac, ref, results, scrollBy, scrollT;
      scrollT = $(this).scrollTop();
      dScroll = scrollT - scroll_amt;
      scroll_amt = scrollT;
      scrollBy = (scrollT * 1.5) + parseInt(titleTop);
      opac = 1.2 - (scrollBy / (title.parent().parent().outerHeight() - 50));
      title.css({
        'margin-top': scrollBy,
        'opacity': opac
      });
      if (scenes[0]) {
        ref = scenes[0].entities;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          entity = ref[j];
          if (entity.classname === 'star') {
            results.push(entity.y -= dScroll * (.5 * entity.w));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    });
    cont = document.getElementById('banner');
    scene = new Scene(cont);
    scenes.push(scene);
    scene.run();
    scene.target = {
      x: 400,
      y: 180
    };
    for (i = j = 1; j <= 200; i = ++j) {
      x = Math.random() * scene.w;
      y = Math.random() * scene.h;
      radius = 2 * Math.random();
      yellow = 255 * Math.random();
      star = new Star(scene, x, y, radius, radius, 'star', yellow);
    }
    ship = new Ship(scene, 150, 100, 220, 80, 'shippy');
    return setTimeout(function() {
      return scene.target.y = 90;
    }, 1000);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBO0lBQUE7O0VBQU07SUFBTixNQUFBLE1BQUE7TUFFRSxXQUFhLFVBQUEsQ0FBQTtZQTRCYixDQUFBLFdBQUEsQ0FBQTtRQTVCYyxJQUFDLENBQUE7UUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLENBQUQsR0FBSyxDQUFBLENBQUUsSUFBQyxDQUFBLFNBQUgsQ0FBYSxDQUFDLE1BQWQsQ0FBQTtRQUNMLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQSxDQUFFLElBQUMsQ0FBQSxTQUFILENBQWEsQ0FBQyxLQUFkLENBQUE7UUFDTCxJQUFDLENBQUEsTUFBRCxHQUNFO1VBQUEsQ0FBQSxFQUFHLEdBQUg7VUFDQSxDQUFBLEVBQUc7UUFESDtNQUxTOztNQVFiLEtBQU8sQ0FBQSxDQUFBLEVBQUE7O01BRVAsR0FBSyxDQUFBLENBQUE7ZUFDSCxXQUFBLENBQVksSUFBQyxDQUFBLElBQWIsRUFBbUIsRUFBbkI7TUFERzs7TUFHTCxNQUFRLENBQUEsQ0FBQTtBQUNOLFlBQUEsTUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO1FBQUEsSUFBQSxHQUFPO1FBRVAsSUFBRyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBbkI7VUFDRSxDQUFBLEdBQUksSUFBQyxDQUFBLENBQUQsR0FBSyxDQUFDLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQVA7VUFDVCxDQUFBLEdBQUksSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFJLENBQUMsTUFBTCxDQUFBO1VBQ1QsTUFBQSxHQUFTLENB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IChAY29udGFpbmVyKS0+XG4gICAgQGVudGl0aWVzID0gW11cbiAgICBAaCA9ICQoQGNvbnRhaW5lcikuaGVpZ2h0KClcbiAgICBAdyA9ICQoQGNvbnRhaW5lcikud2lkdGgoKVxuICAgIEB0YXJnZXQgPVxuICAgICAgeDogMTAwLFxuICAgICAgeTogMjAwXG4gICAgXG4gIHNldHVwOiAtPlxuICAgIFxuICBydW46IC0+XG4gICAgc2V0SW50ZXJ2YWwgQHRpY2ssIDMwXG5cbiAgdXBkYXRlOiAtPlxuICAgIHRoYXQgPSB0aGlzXG4gICAgXG4gICAgaWYgTWF0aC5yYW5kb20oKSA+IC4wMDVcbiAgICAgIHggPSBAdyArICgxMDAgKiBNYXRoLnJhbmRvbSgpKVxuICAgICAgeSA9IEBoICogTWF0aC5yYW5kb20oKVxuICAgICAgcmFkaXVzID0gMiAqIE1hdGgucmFuZG9tKClcbiAgICAgIHllbGxvdyA9IDI1NSAqIE1hdGgucmFuZG9tKClcbiAgICAgIHN0YXIgPSBuZXcgU3RhciB0aGF0LCB4LCB5LCByYWRpdXMsIHJhZGl1cywgJ3N0YXInLCB5ZWxsb3dcbiAgICBcbiAgICBpZiBAZW50aXRpZXMubGVuZ3RoID4gMFxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgZW50aXR5LnVwZGF0ZSgpXG4gICAgXG4gIHRpY2s6ID0+XG4gICAgQHVwZGF0ZSgpXG4gICAgXG5jbGFzcyBFbnRpdHkgXG4gIHZ4OiAwXG4gIHZ5OiAwXG4gIGRpclk6IDFcbiAgZGlyWDogMVxuICBzY3JvbGxUb3A6IDBcbiAgY29uc3RydWN0b3I6IChAc2NlbmUsIEB4LCBAeSwgQHcgPSAwLCBAaCA9IDAsIEBjbGFzc25hbWU9J2VudGl0eScpIC0+XG4gICAgZW50aXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBlbnRpdHkuY2xhc3NOYW1lICs9IEBjbGFzc25hbWVcbiAgICBAZW50aXR5ID0gZW50aXR5XG4gICAgQHNjZW5lLmNvbnRhaW5lci5hcHBlbmRDaGlsZCBlbnRpdHlcbiAgICBAc2NlbmUuZW50aXRpZXMucHVzaCB0aGlzXG4gICAgXG4gICAgXG4gICAgaWYgQHNjZW5lLmRlYnVnXG4gICAgICBjb25zb2xlLmxvZyAnYWRkZWQgJyArIEBjbGFzc25hbWVcbiAgICBcbiAgdXBkYXRlOiAtPlxuICAgIFxuICAgIEBkeCA9IEB4ICsgQHZ4ICogQGRpclhcbiAgICBAZHkgPSBAeSArIEB2eSAqIEBkaXJZXG4gICAgXG4gICAgQHggPSBAZHhcbiAgICBAeSA9IEBkeSArIEBzY2VuZS5zY3JvbGxUb3BcbiAgICBcbiAgICBcbiAgICAkKEBlbnRpdHkpLmNzcyh7XG4gICAgICAnd2lkdGgnOiBAdyArICdweCdcbiAgICAgICdoZWlnaHQnOiBAaCArICdweCdcbiAgICAgICd0b3AnOiBAeSArICdweCdcbiAgICAgICdsZWZ0JzogQHggKyAncHgnIFxuICAgIH0pXG4gICAgXG4gIGRyYXc6IC0+XG4gICAgXG4gIGNoYW5nZURpcjogKCBkaXJlY3Rpb24gPSB4KSAtPlxuICAgIGlmIGRpcmVjdGlvbiA9PSAneCcgXG4gICAgICBAZGlyWCA9ICAtQGRpclhcbiAgICBlbHNlIGlmIGRpcmVjdGlvbiA9PSAneSdcbiAgICAgIEBkaXJZID0gLUBkaXJZXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2cgZGlyZWN0aW9uICsgJyBpcyBub3QgYSB2YWxpZCBkaXJlY3Rpb24nXG4gICAgXG5jbGFzcyBTaGlwIGV4dGVuZHMgRW50aXR5XG4gIHNwZWVkWDogM1xuICBzcGVlZFk6IDNcbiAgXG4gIHVwZGF0ZTogLT5cbiAgICBAZmx5KClcbiAgICBzdXBlcigpICBcbiAgICBjbG91ZFBvc3MgPSBNYXRoLnJhbmRvbSgpXG4gICAgaWYgY2xvdWRQb3NzID4gLjNcbiAgICAgIGZvciBpIGluIFswLi4zXVxuICAgICAgICBAY3JlYXRlQ2xvdWQoKVxuICAgIGlmIGNsb3VkUG9zcyA+IC43XG4gICAgICBAY3JlYXRlQ2xvdWQoKVxuICAgIGlmIGNsb3VkUG9zcyA+IC45XG4gICAgICBAY3JlYXRlQ2xvdWQoKVxuICBcbiAgZmx5OiAtPlxuICAgIFxuICAgIFxuICAgIGlmIEB4IDwgQHNjZW5lLnRhcmdldC54IC0gMTBcbiAgICAgIEB2eCA9IEBzcGVlZFhcbiAgICBlbHNlIGlmIEB4ID4gQHNjZW5lLnRhcmdldC54ICsgMTBcbiAgICAgIEB2eCA9IC1Ac3BlZWRYXG4gICAgZWxzZSBpZiBAeCA+PSBAc2NlbmUudGFyZ2V0LnggLSAxMCBvciBAeCA8PSBAc2NlbmUudGFyZ2V0LnggKyAxMFxuICAgICAgQHZ4ID0gMFxuICAgICAgXG4gICAgaWYgQHkgPCBAc2NlbmUudGFyZ2V0LnkgLSA1XG4gICAgICBAdnkgPSBAc3BlZWRZXG4gICAgZWxzZSBpZiBAeSA+IEBzY2VuZS50YXJnZXQueSArIDVcbiAgICAgIEB2eSA9IC1Ac3BlZWRZICAgXG4gICAgZWxzZSBpZiBAeSA8PSBAc2NlbmUudGFyZ2V0LnkgKyA1IG9yIEB5ID49IEBzY2VuZS50YXJnZXQueSAtIDVcbiAgICAgIEB2eSA9IDBcbiAgICAgIFxuICBjaGFuY2VPZkNoYW5nZVg6ICh4KSAtPlxuICAgIGNoYW5jZSA9IDAuMDAxXG4gICAgaWYgeCA+IEBzY2VuZS53ICogLjcgb3IgeCA8IEBzY2VuZS53ICogLjFcbiAgICAgIGNoYW5jZSA9IC4xXG4gICAgaWYgTWF0aC5yYW5kb20oKSA8IGNoYW5jZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgXG4gIGNoYW5jZU9mQ2hhbmdlWTogKHkpIC0+XG4gICAgY2hhbmNlID0gMC4wNVxuICAgIGlmIHkgPiBAc2NlbmUuaCAqLjggb3IgeSA8IEBzY2VuZS5oICogLjJcbiAgICAgIGNoYW5jZSA9IDAuM1xuICAgICAgXG4gICAgaWYgTWF0aC5yYW5kb20oKSA8IGNoYW5jZSBcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIFxuICBjcmVhdGVDbG91ZDogLT5cbiAgICBvcGFjID0gTWF0aC5yYW5kb20oKVxuICAgIFxuICAgIGlmIE1hdGgucmFuZG9tKCkgPiAuNlxuICAgICAgcmFkaXVzID0gNjAgKiBNYXRoLnJhbmRvbSgpXG4gICAgZWxzZVxuICAgICAgcmFkaXVzID0gNDAgKiBNYXRoLnJhbmRvbSgpXG4gICAgICBcbiAgICB5ID0gQHkgKyBAaCAvIDRcbiAgICB5ICs9IDIwICogTWF0aC5yYW5kb20oKVxuICAgIGlmIE1hdGgucmFuZG9tKCkgPiAuNSB0aGVuIHkgKj0gLTFcbiAgICBcbiAgICBjbG91ZCA9IG5ldyBDbG91ZCBAc2NlbmUsIEB4LCB5LCByYWRpdXMsIHJhZGl1cywgb3BhY1xuICBcbmNsYXNzIENsb3VkIGV4dGVuZHMgRW50aXR5XG4gIHZ4OiAtNVxuICBjb25zdHJ1Y3RvcjogKHNjZW5lLHgseSx3LGgsIEBvcGFjaXR5KSAtPlxuICAgIHN1cGVyIHNjZW5lLCB4LCB5LCB3LCBoLCAnY2xvdWQnXG4gICAgJChAZW50aXR5KS5jc3MoJ29wYWNpdHknLCBAb3BhY2l0eSlcbiAgICBAdnggPSBAdnggKiBNYXRoLnJhbmRvbSgpIC0gM1xuICAgIFxuICAgICNrZWVwIHRhYnMgb24gaG93IG1hbnkgd2UncmUgY3JlYXRpbmcgLi4uXG4gICAgI2NvbnNvbGUubG9nIEBzY2VuZS5lbnRpdGllcy5sZW5ndGhcbiAgICBcbiAgdXBkYXRlOiAtPlxuICAgIFxuICAgIHN1cGVyKClcbiAgICBAb3BhY2l0eSAtPSAuMDA0XG4gICAgJChAZW50aXR5KS5jc3MoJ29wYWNpdHknLCBAb3BhY2l0eSlcbiAgICBpZiBAb3BhY2l0eSA8PSAwXG4gICAgICBAa2lsbCgpXG4gIGtpbGw6IC0+XG4gICAgdGhhdCA9IHRoaXNcbiAgICBAc2NlbmUuZW50aXRpZXNbdC4udF0gPSBbXSBpZiAoIHQgPSBAc2NlbmUuZW50aXRpZXMuaW5kZXhPZih0aGF0KSlcbiAgICAgXG4gICAgJChAZW50aXR5KS5yZW1vdmUoKVxuICAgIFxuY2xhc3MgU3RhciBleHRlbmRzIEVudGl0eVxuICB2eDogLTEwXG4gIFxuICBjb25zdHJ1Y3RvcjogKHNjZW5lLCB4LCB5LCB3LCBoLCBjbGFzc25hbWUsIEB5ZWxsb3dCeSA9IDApIC0+XG4gICAgc3VwZXIgc2NlbmUsIHgsIHksIHcsIGgsICdzdGFyJ1xuICAgIGJsdWUgPSBAeWVsbG93QnlcbiAgICAkKEBlbnRpdHkpLmNzcygnYmFja2dyb3VuZCcsICdyZ2IoMjU1LDI1NSwnICsgYmx1ZSArICcpJylcbiAgXG4gIHVwZGF0ZTogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHggPCAwXG4gICAgICBAa2lsbCgpXG4gIFxuICBraWxsOiAtPlxuICAgIHRoYXQgPSB0aGlzXG4gICAgQHNjZW5lLmVudGl0aWVzW3QuLnRdID0gW10gaWYgKCB0ID0gQHNjZW5lLmVudGl0aWVzLmluZGV4T2YodGhhdCkpXG4gICAgIFxuICAgICQoQGVudGl0eSkucmVtb3ZlKClcbiAgICAgIFxuJCAtPlxuICBzY2VuZXMgPSBbXVxuICB0aXRsZSA9ICQoJ2gxJykgXG4gIHRpdGxlVG9wID0gdGl0bGUuY3NzKCdtYXJnaW4tdG9wJykuc3BsaXQoJ3B4JylbMF1cbiAgXG4gIHZoID0gJCh3aW5kb3cpLmhlaWdodCgpXG4gIHZoID0gaWYgdmggPiA1MDAgdGhlbiB2aCBlbHNlIDUwMFxuICBpZiB2aCA+IDcwMCB0aGVuIHZoID0gNzAwXG4gICQoJyNiYW5uZXInKS5jc3MoJ2hlaWdodCcsIHZoKVxuICBzY3JvbGxfYW10ID0gMFxuICBkU2Nyb2xsID0gMFxuICBcblxuICBcbiAgJCgnI2Jhbm5lcicpLm1vdXNlbW92ZSAoZSktPlxuICAgIFxuICAgIG1vdXNlWCA9IGUuY2xpZW50WDtcbiAgICBtb3VzZVkgPSBlLmNsaWVudFk7XG4gICAgaWYgc2NlbmVzWzBdXG4gICAgICBzY2VuZXNbMF0udGFyZ2V0ID0gXG4gICAgICAgIHg6IG1vdXNlWCAtIDEzMFxuICAgICAgICB5OiBtb3VzZVkgLSAxMjBcbiAgICAgICAgXG4gICQoJyNiYW5uZXInKS5tb3VzZWxlYXZlICgpLT5cbiAgICBpZiBzY2VuZXNbMF1cbiAgICAgICAgc2NlbmVzWzBdLnRhcmdldCA9IFxuICAgICAgICAgIHg6IDIwMCxcbiAgICAgICAgICB5OiAyMDBcbiAgXG4gICQod2luZG93KS5vbiAnc2Nyb2xsJywgKCktPlxuICAgICAgc2Nyb2xsVCA9ICQodGhpcykuc2Nyb2xsVG9wKClcbiAgICAgIGRTY3JvbGwgPSBzY3JvbGxUIC0gc2Nyb2xsX2FtdFxuICAgICAgc2Nyb2xsX2FtdCA9IHNjcm9sbFRcbiAgICAgIFxuICAgICAgXG4gICAgICBcbiAgICAgIHNjcm9sbEJ5ID0gKHNjcm9sbFQgKiAxLjUpICsgcGFyc2VJbnQodGl0bGVUb3ApXG4gICAgICBvcGFjID0gMS4yIC0gKHNjcm9sbEJ5IC8gKHRpdGxlLnBhcmVudCgpLnBhcmVudCgpLm91dGVySGVpZ2h0KCkgLSA1MCkpXG4gICAgIFxuICAgICAgXG4gICAgICB0aXRsZS5jc3Moe1xuICAgICAgICAgJ21hcmdpbi10b3AnOiBzY3JvbGxCeVxuICAgICAgICAgJ29wYWNpdHknOiBvcGFjICAgICAgXG4gICAgICAgICAgICAgICAgIH0pXG4gICAgICBcbiAgICAgIGlmIHNjZW5lc1swXVxuICAgICAgICBmb3IgZW50aXR5IGluIHNjZW5lc1swXS5lbnRpdGllc1xuICAgICAgICAgIGlmIGVudGl0eS5jbGFzc25hbWUgPT0gJ3N0YXInXG4gICAgICAgICAgICBlbnRpdHkueSAtPSBkU2Nyb2xsICogKC41ICogZW50aXR5LncpXG4gICAgICBcbiAgY29udCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICdiYW5uZXInXG4gIHNjZW5lID0gbmV3IFNjZW5lIGNvbnRcbiAgc2NlbmVzLnB1c2ggc2NlbmVcbiAgc2NlbmUucnVuKClcbiAgXG4gIHNjZW5lLnRhcmdldCA9IFxuICAgIHg6IDQwMFxuICAgIHk6IDE4MFxuICAgIFxuXG4gICAgXG4gIGZvciBpIGluIFsxLi4yMDBdXG4gICAgeCA9IE1hdGgucmFuZG9tKCkgKiBzY2VuZS53XG4gICAgeSA9IE1hdGgucmFuZG9tKCkgKiBzY2VuZS5oXG4gICAgcmFkaXVzID0gMiAqIE1hdGgucmFuZG9tKClcbiAgICB5ZWxsb3cgPSAyNTUgKiBNYXRoLnJhbmRvbSgpXG4gICAgICBcbiAgICBzdGFyID0gbmV3IFN0YXIgc2NlbmUsIHgsIHksIHJhZGl1cywgcmFkaXVzLCAnc3RhcicsIHllbGxvd1xuICAgIFxuICBzaGlwID0gbmV3IFNoaXAgc2NlbmUsIDE1MCwgMTAwLCAyMjAsIDgwLCAnc2hpcHB5J1xuICBcbiAgc2V0VGltZW91dCAoKS0+XG4gICAgc2NlbmUudGFyZ2V0LnkgPSA5MFxuICAsIDEwMDAiXX0=
//# sourceURL=coffeescript

