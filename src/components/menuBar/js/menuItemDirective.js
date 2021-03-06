
angular
  .module('material.components.menuBar')
  .directive('mdMenuItem', MenuItemDirective);

 /* @ngInject */
function MenuItemDirective($mdUtil) {
  return {
    controller: 'MenuItemController',
    require: ['mdMenuItem', '?ngModel'],
    priority: 210, // ensure that our post link runs after ngAria
    compile: function(templateEl, templateAttrs) {
      var type = templateAttrs.type;
      var inMenuBarClass = 'md-in-menu-bar';

      // Note: This allows us to show the `check` icon for the md-menu-bar items.
      // The `md-in-menu-bar` class is set by the mdMenuBar directive.
      if ((type == 'checkbox' || type == 'radio') && templateEl.hasClass(inMenuBarClass)) {
        var text = templateEl[0].textContent;
        var buttonEl = angular.element('<md-button type="button"></md-button>');
            buttonEl.html(text);
            buttonEl.attr('tabindex', '0');

        templateEl.html('');
        templateEl.append(angular.element('<md-icon md-svg-icon="check"></md-icon>'));
        templateEl.append(buttonEl);
        templateEl.addClass('md-indent').removeClass(inMenuBarClass);

        setDefault('role', type == 'checkbox' ? 'menuitemcheckbox' : 'menuitemradio', buttonEl);
        moveAttrToButton('ng-disabled');

      } else {
        setDefault('role', 'menuitem', templateEl[0].querySelector('md-button, button, a'));
      }


      return function(scope, el, attrs, ctrls) {
        var ctrl = ctrls[0];
        var ngModel = ctrls[1];
        ctrl.init(ngModel);
      };

      function setDefault(attr, val, el) {
        el = el || templateEl;
        if (el instanceof angular.element) {
          el = el[0];
        }
        if (!el.hasAttribute(attr)) {
          el.setAttribute(attr, val);
        }
      }

      function moveAttrToButton(attribute) {
        var attributes = $mdUtil.prefixer(attribute);

        angular.forEach(attributes, function(attr) {
          if (templateEl[0].hasAttribute(attr)) {
            var val = templateEl[0].getAttribute(attr);
            buttonEl[0].setAttribute(attr, val);
            templateEl[0].removeAttribute(attr);
          }
        });
      }
    }
  };
}
