'use strict';

function SelectOptionUtil() {}

SelectOptionUtil.toSelectOption = function(array){
    return [''].concat(array).map(function(value) {return {name: value, value: value};});
};

module.exports = SelectOptionUtil;
