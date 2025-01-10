"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeLocale = changeLocale;

function changeLocale(req, res, next) {
  var locale = req.params.locale;
  res.cookie('nodepop-locale', locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días

  });
  res.redirect('back');
}