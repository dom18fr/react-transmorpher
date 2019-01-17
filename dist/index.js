"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTransmorpher = exports.Transmorpher = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var transmorphChildren = function transmorphChildren(node, componentMap) {
  var _Node = Node,
      ELEMENT_NODE = _Node.ELEMENT_NODE,
      TEXT_NODE = _Node.TEXT_NODE;
  var jsxAttributesMap = {
    class: 'className',
    for: 'htmlFor',
    'xlink:href': 'xlinkHref',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    'accept-charset': 'acceptCharset',
    datetime: 'dateTime',
    value: 'defaultValue'
  };

  var transmorph = function transmorph(node, componentMap) {
    if (ELEMENT_NODE === node.nodeType) {
      var transmorphAttributes = function transmorphAttributes(node) {
        if (undefined === node.attributes) {
          return [];
        }

        var getAttributeName = function getAttributeName(attributeNode) {
          return jsxAttributesMap[attributeNode.nodeName] || attributeNode.nodeName;
        };

        return Object.values(node.attributes).reduce(function (attributes, attributeNode) {
          return _objectSpread({}, attributes, _defineProperty({}, getAttributeName(attributeNode), attributeNode.nodeValue));
        }, {});
      };

      var getComponent = function getComponent(node, componentMap) {
        var Markup = function Markup(props) {
          return _react.default.createElement(props.Tag || _react.default.Fragment, props.attributes, rebuildChildren(props.transmorphedChildren));
        };

        var matching = componentMap.filter(function (item) {
          return item.node == node;
        });

        if (matching.length) {
          return matching[0].component;
        }

        return Markup;
      };

      var component = getComponent(node, componentMap);
      return {
        component: component,
        Tag: node.tagName.toLowerCase(),
        attributes: transmorphAttributes(node),
        children: transmorphChildren(node, componentMap),
        awake: component.hasOwnProperty('awake') ? component.awake : true,
        componentKey: component.key
      };
    } else if (TEXT_NODE === node.nodeType) {
      if (node.textContent.length === 0) {
        return undefined;
      }

      return node.textContent;
    }

    return undefined;
  };

  return [].slice.call(node.childNodes).reduce(function (acc, node) {
    var transmorphed = transmorph(node, componentMap);
    return transmorphed ? [].concat(_toConsumableArray(acc), [transmorphed]) : acc;
  }, []);
};

var rebuildChildren = function rebuildChildren(transmorphedChildren) {
  var rebuildChild = function rebuildChild(transmorphedChild, key) {
    if ('object' !== _typeof(transmorphedChild)) {
      return transmorphedChild;
    }

    return _react.default.createElement(transmorphedChild.component, {
      Tag: transmorphedChild.Tag,
      attributes: transmorphedChild.attributes,
      key: key,
      transmorphedChildren: transmorphedChild.children
    });
  };

  return Object.keys(transmorphedChildren).reduce(function (acc, key) {
    if (false === transmorphedChildren[key].hasOwnProperty('awake') || true === transmorphedChildren[key].awake) {
      return [].concat(_toConsumableArray(acc), [rebuildChild(transmorphedChildren[key], key)]);
    }

    return _toConsumableArray(acc);
  }, []);
};

var Transmorpher = function Transmorpher(props) {
  var getNodeFromQuery = function getNodeFromQuery(rootNode, query) {
    if (typeof query == 'string') {
      return rootNode.querySelector(query);
    }

    if (typeof query == 'function') {
      return query(rootNode);
    }

    return null;
  };

  var componentMapFactory = function componentMapFactory(rootNode, components) {
    return Object.keys(components).reduce(function (acc, key) {
      var component = components[key];
      var node = getNodeFromQuery(rootNode, component.query);
      var awake = component.awake;

      if (node) {
        return [].concat(_toConsumableArray(acc), [{
          component: component,
          node: node,
          awake: awake
        }]);
      }

      return acc;
    }, []);
  };

  var body = document.createElement('body');
  body.innerHTML = props.source.trim();
  var rootNode = body.lastChild;
  var componentMap = componentMapFactory(rootNode, props.components);
  return rebuildChildren(transmorphChildren(rootNode, componentMap), componentMap);
};

exports.Transmorpher = Transmorpher;

var withTransmorpher = function withTransmorpher(_ref) {
  var query = _ref.query,
      key = _ref.key,
      asleep = _ref.asleep;
  return function (WithTransmorpherComponent) {
    var _class, _temp;

    var operatedChildren = function operatedChildren(children, operations) {
      return children.map(function (child) {
        if (typeof child === 'string') {
          return child;
        }

        var operatedChild = Object.assign({}, child);

        if (operations.hasOwnProperty(child.componentKey)) {
          operatedChild = _objectSpread({}, child, operations[child.componentKey]);
        }

        if (null !== operatedChild.children && operatedChild.children.length > 0) {
          operatedChild = _objectSpread({}, operatedChild, {
            children: operatedChildren(operatedChild.children, operations)
          });
        }

        return operatedChild;
      });
    };

    return _temp = _class =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderTag", function (operations) {
          var _this$props = _this.props,
              Tag = _this$props.Tag,
              attributes = _this$props.attributes;
          return _react.default.createElement(Tag, attributes, _this.renderChildren(operations));
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderChildren", function (operations) {
          var transmorphedChildren = _this.props.transmorphedChildren;

          if (transmorphedChildren.length === 0) {
            return null;
          }

          if (operations !== undefined) {
            var operated = operatedChildren(transmorphedChildren, operations);
            return rebuildChildren(operated);
          }

          return rebuildChildren(transmorphedChildren);
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "render", function () {
          return _react.default.createElement(WithTransmorpherComponent, _extends({}, _this.props, {
            renderChildren: _this.renderChildren,
            renderTag: _this.renderTag
          }));
        });

        return _this;
      }

      return _class;
    }(_react.default.Component), _defineProperty(_class, "query", query), _defineProperty(_class, "awake", asleep === undefined ? true : !asleep), _defineProperty(_class, "key", key), _temp;
  };
};

exports.withTransmorpher = withTransmorpher;