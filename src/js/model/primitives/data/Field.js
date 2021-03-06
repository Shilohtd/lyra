'use strict';
var dl = require('datalib'),
    vl = require('vega-lite'),
    inherits = require('inherits'),
    Primitive = require('../Primitive'),
    getParent = require('../../../util/hierarchy').getParent,
    TYPES = vl.data.types;

/**
 * @classdesc A Lyra Data Field Primitive.
 * @description  This class does not have a corresponding Vega definition.
 * However, treating fields as a first-class Primitive in Lyra is useful for
 * a variety of reasons (e.g., storing type and aggregate information).
 * @extends {Primitive}
 *
 * @param {string} name - The name of the field.
 * @param {string} ptype - The JavaScript primitive type of the field
 * (boolean, string, etc.).
 * @param {number} [_parent] - The ID of the field's parent datasource
 *
 * @property {string} _name - The name of the field.
 * @property {string} _ptype - The JavaScript primitive type of the field
 * (boolean, string, etc.).
 * @property {string} _type - The data type (nominal, ordinal, quantitative, temporal).
 * @property {*} _aggregate TBD.
 * @property {*} _bin TBD.
 * @property {Function} $ - An accessor function for the field.
 *
 * @constructor
 */
function Field(name, ptype, _parent) {
  this._name = name;
  this._ptype = ptype;         // primitive type (boolean/string/etc.)
  this._type = TYPES[ptype];  // nominal, ordinal, etc.

  this._aggregate = null;
  this._bin = null;

  this.$ = dl.$(name);

  if (_parent) {
    this._parent = _parent;
  }

  return Primitive.call(this);
}

inherits(Field, Primitive);

/**
 * Gets/sets the Field's statistical profile. If one does not exist, calls
 * its {@link Dataset#summary|Dataset's profiler} first.
 *
 * @param {Object} [p] - A statistical profile to set
 * @returns {Object} The Field's summary profile.
 */
Field.prototype.profile = function(p) {
  if (p !== undefined) {
    this._profile = p;
    return this;
  } else if (this._profile) {
    return this._profile;
  }

  return (getParent(this).summary(), this._profile);
};

module.exports = Field;
