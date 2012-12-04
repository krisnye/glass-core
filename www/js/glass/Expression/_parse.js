(function() {
    var global = (function() {
        return this;
    })();
    var Expression = this;
    var parse; //  assigned during _init_
    var SyntaxError; //  assigned during _init_
    var values; //  assigned during _init_
    var _parse = this._parse = {
        parse: function(input, startRule) {
            var parseFunctions = {
                "conditional": parse_conditional,
                "or": parse_or,
                "and": parse_and,
                "equality": parse_equality,
                "rel": parse_rel,
                "sum": parse_sum,
                "product": parse_product,
                "not": parse_not,
                "primary": parse_primary,
                "group": parse_group,
                "literal": parse_literal,
                "boolean": parse_boolean,
                "number": parse_number,
                "hex": parse_hex,
                "string": parse_string,
                "array": parse_array,
                "values": parse_values,
                "object": parse_object,
                "keyvalue": parse_keyvalue,
                "keyvalues": parse_keyvalues,
                "ref": parse_ref,
                "id": parse_id,
                "property": parse_property,
                "slashProperty": parse_slashProperty,
                "s": parse_s,
                "path": parse_path,
                "root": parse_root,
                "step": parse_step,
                "implicitDotRoot": parse_implicitDotRoot,
                "explicitDotRoot": parse_explicitDotRoot,
                "dotStep": parse_dotStep,
                "noDotStep": parse_noDotStep
            };
            if (startRule !== undefined) {
                if (parseFunctions[startRule] === undefined) {
                    throw new Error("Invalid rule name: " + quote(startRule) + ".");
                }
            } else {
                startRule = "conditional";
            }
            var pos = 0;
            var reportFailures = 0;
            var rightmostFailuresPos = 0;
            var rightmostFailuresExpected = [];
            function padLeft(input, padding, length) {
                var result = input;
                var padLength = length - input.length;
                for (var i = 0; i < padLength; i++) {
                    result = padding + result;
                }
                return result;
            }
            function escape(ch) {
                var charCode = ch.charCodeAt(0);
                var escapeChar;
                var length;
                if (charCode <= 0xFF) {
                    escapeChar = 'x';
                    length = 2;
                } else {
                    escapeChar = 'u';
                    length = 4;
                }
                return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
            }
            function matchFailed(failure) {
                if (pos < rightmostFailuresPos) {
                    return;
                }
                if (pos > rightmostFailuresPos) {
                    rightmostFailuresPos = pos;
                    rightmostFailuresExpected = [];
                }
                rightmostFailuresExpected.push(failure);
            }
            function parse_conditional() {
                var result0, result1, result2, result3, result4, result5;
                var pos0, pos1, pos2, pos3;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_or();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    pos3 = pos;
                    if (input.charCodeAt(pos) === 63) {
                        result2 = "?";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"?\"");
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_conditional();
                        if (result3 !== null) {
                            if (input.charCodeAt(pos) === 58) {
                                result4 = ":";
                                pos++;
                            } else {
                                result4 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\":\"");
                                }
                            }
                            if (result4 !== null) {
                                result5 = parse_conditional();
                                if (result5 !== null) {
                                    result2 = [result2, result3, result4, result5];
                                } else {
                                    result2 = null;
                                    pos = pos3;
                                }
                            } else {
                                result2 = null;
                                pos = pos3;
                            }
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                    } else {
                        result2 = null;
                        pos = pos3;
                    }
                    if (result2 !== null) {
                        result2 = (function(offset, b, c) {
                            return [b, c];
                        })(pos2, result2[1], result2[3]);
                    }
                    if (result2 === null) {
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        pos3 = pos;
                        if (input.charCodeAt(pos) === 63) {
                            result2 = "?";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"?\"");
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_conditional();
                            if (result3 !== null) {
                                if (input.charCodeAt(pos) === 58) {
                                    result4 = ":";
                                    pos++;
                                } else {
                                    result4 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\":\"");
                                    }
                                }
                                if (result4 !== null) {
                                    result5 = parse_conditional();
                                    if (result5 !== null) {
                                        result2 = [result2, result3, result4, result5];
                                    } else {
                                        result2 = null;
                                        pos = pos3;
                                    }
                                } else {
                                    result2 = null;
                                    pos = pos3;
                                }
                            } else {
                                result2 = null;
                                pos = pos3;
                            }
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                        if (result2 !== null) {
                            result2 = (function(offset, b, c) {
                                return [b, c];
                            })(pos2, result2[1], result2[3]);
                        }
                        if (result2 === null) {
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, e, args) {
                        while (args.length > 0) {
                            e = expr("?:", [e].concat(args.pop()));
                        }
                        return e;
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_or() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_and();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.substr(pos, 2) === "or") {
                        result2 = "or";
                        pos += 2;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"or\"");
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_and();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.substr(pos, 2) === "or") {
                            result2 = "or";
                            pos += 2;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"or\"");
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_and();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_and() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_equality();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.substr(pos, 3) === "and") {
                        result2 = "and";
                        pos += 3;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"and\"");
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_equality();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.substr(pos, 3) === "and") {
                            result2 = "and";
                            pos += 3;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"and\"");
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_equality();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_equality() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_rel();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.substr(pos, 2) === "==") {
                        result2 = "==";
                        pos += 2;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"==\"");
                        }
                    }
                    if (result2 === null) {
                        if (input.substr(pos, 2) === "!=") {
                            result2 = "!=";
                            pos += 2;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"!=\"");
                            }
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_rel();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.substr(pos, 2) === "==") {
                            result2 = "==";
                            pos += 2;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"==\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.substr(pos, 2) === "!=") {
                                result2 = "!=";
                                pos += 2;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"!=\"");
                                }
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_rel();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_rel() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_sum();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.substr(pos, 2) === "<=") {
                        result2 = "<=";
                        pos += 2;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"<=\"");
                        }
                    }
                    if (result2 === null) {
                        if (input.substr(pos, 2) === ">=") {
                            result2 = ">=";
                            pos += 2;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\">=\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.charCodeAt(pos) === 60) {
                                result2 = "<";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"<\"");
                                }
                            }
                            if (result2 === null) {
                                if (input.charCodeAt(pos) === 62) {
                                    result2 = ">";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\">\"");
                                    }
                                }
                            }
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_sum();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.substr(pos, 2) === "<=") {
                            result2 = "<=";
                            pos += 2;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"<=\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.substr(pos, 2) === ">=") {
                                result2 = ">=";
                                pos += 2;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\">=\"");
                                }
                            }
                            if (result2 === null) {
                                if (input.charCodeAt(pos) === 60) {
                                    result2 = "<";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"<\"");
                                    }
                                }
                                if (result2 === null) {
                                    if (input.charCodeAt(pos) === 62) {
                                        result2 = ">";
                                        pos++;
                                    } else {
                                        result2 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\">\"");
                                        }
                                    }
                                }
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_sum();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_sum() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_product();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.charCodeAt(pos) === 43) {
                        result2 = "+";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"+\"");
                        }
                    }
                    if (result2 === null) {
                        if (input.charCodeAt(pos) === 45) {
                            result2 = "-";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"-\"");
                            }
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_product();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.charCodeAt(pos) === 43) {
                            result2 = "+";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"+\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.charCodeAt(pos) === 45) {
                                result2 = "-";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"-\"");
                                }
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_product();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_product() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_not();
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    if (input.charCodeAt(pos) === 42) {
                        result2 = "*";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"*\"");
                        }
                    }
                    if (result2 === null) {
                        if (input.substr(pos, 3) === "div") {
                            result2 = "div";
                            pos += 3;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"div\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.substr(pos, 3) === "mod") {
                                result2 = "mod";
                                pos += 3;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"mod\"");
                                }
                            }
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_not();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    } else {
                        result2 = null;
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        if (input.charCodeAt(pos) === 42) {
                            result2 = "*";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"*\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.substr(pos, 3) === "div") {
                                result2 = "div";
                                pos += 3;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"div\"");
                                }
                            }
                            if (result2 === null) {
                                if (input.substr(pos, 3) === "mod") {
                                    result2 = "mod";
                                    pos += 3;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"mod\"");
                                    }
                                }
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_not();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinLeft(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_not() {
                var result0, result1, result2;
                var pos0, pos1, pos2, pos3;
                pos0 = pos;
                pos1 = pos;
                result0 = [];
                pos2 = pos;
                pos3 = pos;
                result1 = parse_s();
                if (result1 !== null) {
                    if (input.charCodeAt(pos) === 33) {
                        result2 = "!";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"!\"");
                        }
                    }
                    if (result2 === null) {
                        if (input.charCodeAt(pos) === 126) {
                            result2 = "~";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"~\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.charCodeAt(pos) === 43) {
                                result2 = "+";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"+\"");
                                }
                            }
                            if (result2 === null) {
                                if (input.charCodeAt(pos) === 45) {
                                    result2 = "-";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"-\"");
                                    }
                                }
                            }
                        }
                    }
                    if (result2 !== null) {
                        result1 = [result1, result2];
                    } else {
                        result1 = null;
                        pos = pos3;
                    }
                } else {
                    result1 = null;
                    pos = pos3;
                }
                if (result1 !== null) {
                    result1 = (function(offset, op) {
                        return op;
                    })(pos2, result1[1]);
                }
                if (result1 === null) {
                    pos = pos2;
                }
                while (result1 !== null) {
                    result0.push(result1);
                    pos2 = pos;
                    pos3 = pos;
                    result1 = parse_s();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 33) {
                            result2 = "!";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"!\"");
                            }
                        }
                        if (result2 === null) {
                            if (input.charCodeAt(pos) === 126) {
                                result2 = "~";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"~\"");
                                }
                            }
                            if (result2 === null) {
                                if (input.charCodeAt(pos) === 43) {
                                    result2 = "+";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"+\"");
                                    }
                                }
                                if (result2 === null) {
                                    if (input.charCodeAt(pos) === 45) {
                                        result2 = "-";
                                        pos++;
                                    } else {
                                        result2 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\"-\"");
                                        }
                                    }
                                }
                            }
                        }
                        if (result2 !== null) {
                            result1 = [result1, result2];
                        } else {
                            result1 = null;
                            pos = pos3;
                        }
                    } else {
                        result1 = null;
                        pos = pos3;
                    }
                    if (result1 !== null) {
                        result1 = (function(offset, op) {
                            return op;
                        })(pos2, result1[1]);
                    }
                    if (result1 === null) {
                        pos = pos2;
                    }
                }
                if (result0 !== null) {
                    result1 = parse_primary();
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, ops, b) {
                        return unaryRight(ops, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_primary() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_s();
                if (result0 !== null) {
                    result1 = parse_group();
                    if (result1 === null) {
                        result1 = parse_literal();
                        if (result1 === null) {
                            result1 = parse_path();
                        }
                    }
                    if (result1 !== null) {
                        result2 = parse_s();
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a;
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_group() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 40) {
                    result0 = "(";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"(\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_conditional();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 41) {
                            result2 = ")";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\")\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a;
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_literal() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_s();
                if (result0 !== null) {
                    result1 = parse_boolean();
                    if (result1 === null) {
                        result1 = parse_number();
                        if (result1 === null) {
                            result1 = parse_string();
                            if (result1 === null) {
                                result1 = parse_array();
                                if (result1 === null) {
                                    result1 = parse_object();
                                }
                            }
                        }
                    }
                    if (result1 !== null) {
                        result2 = parse_s();
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a;
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_boolean() {
                var result0;
                var pos0;
                pos0 = pos;
                if (input.substr(pos, 4) === "true") {
                    result0 = "true";
                    pos += 4;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"true\"");
                    }
                }
                if (result0 === null) {
                    if (input.substr(pos, 5) === "false") {
                        result0 = "false";
                        pos += 5;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"false\"");
                        }
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a == "true";
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_number() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2;
                pos0 = pos;
                pos1 = pos;
                if (/^[0-9]/.test(input.charAt(pos))) {
                    result1 = input.charAt(pos);
                    pos++;
                } else {
                    result1 = null;
                    if (reportFailures === 0) {
                        matchFailed("[0-9]");
                    }
                }
                if (result1 !== null) {
                    result0 = [];
                    while (result1 !== null) {
                        result0.push(result1);
                        if (/^[0-9]/.test(input.charAt(pos))) {
                            result1 = input.charAt(pos);
                            pos++;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("[0-9]");
                            }
                        }
                    }
                } else {
                    result0 = null;
                }
                if (result0 !== null) {
                    pos2 = pos;
                    if (input.charCodeAt(pos) === 46) {
                        result1 = ".";
                        pos++;
                    } else {
                        result1 = null;
                        if (reportFailures === 0) {
                            matchFailed("\".\"");
                        }
                    }
                    if (result1 !== null) {
                        if (/^[0-9]/.test(input.charAt(pos))) {
                            result3 = input.charAt(pos);
                            pos++;
                        } else {
                            result3 = null;
                            if (reportFailures === 0) {
                                matchFailed("[0-9]");
                            }
                        }
                        if (result3 !== null) {
                            result2 = [];
                            while (result3 !== null) {
                                result2.push(result3);
                                if (/^[0-9]/.test(input.charAt(pos))) {
                                    result3 = input.charAt(pos);
                                    pos++;
                                } else {
                                    result3 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("[0-9]");
                                    }
                                }
                            }
                        } else {
                            result2 = null;
                        }
                        if (result2 !== null) {
                            result1 = [result1, result2];
                        } else {
                            result1 = null;
                            pos = pos2;
                        }
                    } else {
                        result1 = null;
                        pos = pos2;
                    }
                    result1 = result1 !== null ? result1: "";
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return parseFloat(toString(a));
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_hex() {
                var result0;
                if (/^[a-fA-F0-9]/.test(input.charAt(pos))) {
                    result0 = input.charAt(pos);
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("[a-fA-F0-9]");
                    }
                }
                return result0;
            }
            function parse_string() {
                var result0, result1, result2, result3, result4, result5, result6, result7;
                var pos0, pos1, pos2, pos3;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 34) {
                    result0 = "\"";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"\\\"\"");
                    }
                }
                if (result0 !== null) {
                    result1 = [];
                    if (/^[\0-!#-\\^-\uFFFF]/.test(input.charAt(pos))) {
                        result2 = input.charAt(pos);
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("[\\0-!#-\\\\^-\\uFFFF]");
                        }
                    }
                    if (result2 === null) {
                        pos2 = pos;
                        if (input.charCodeAt(pos) === 92) {
                            result2 = "\\";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"\\\\\"");
                            }
                        }
                        if (result2 !== null) {
                            if (input.charCodeAt(pos) === 34) {
                                result3 = "\"";
                                pos++;
                            } else {
                                result3 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"\\\"\"");
                                }
                            }
                            if (result3 === null) {
                                if (input.charCodeAt(pos) === 92) {
                                    result3 = "\\";
                                    pos++;
                                } else {
                                    result3 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"\\\\\"");
                                    }
                                }
                                if (result3 === null) {
                                    if (input.charCodeAt(pos) === 47) {
                                        result3 = "/";
                                        pos++;
                                    } else {
                                        result3 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\"/\"");
                                        }
                                    }
                                    if (result3 === null) {
                                        if (input.charCodeAt(pos) === 98) {
                                            result3 = "b";
                                            pos++;
                                        } else {
                                            result3 = null;
                                            if (reportFailures === 0) {
                                                matchFailed("\"b\"");
                                            }
                                        }
                                        if (result3 === null) {
                                            if (input.charCodeAt(pos) === 102) {
                                                result3 = "f";
                                                pos++;
                                            } else {
                                                result3 = null;
                                                if (reportFailures === 0) {
                                                    matchFailed("\"f\"");
                                                }
                                            }
                                            if (result3 === null) {
                                                if (input.charCodeAt(pos) === 110) {
                                                    result3 = "n";
                                                    pos++;
                                                } else {
                                                    result3 = null;
                                                    if (reportFailures === 0) {
                                                        matchFailed("\"n\"");
                                                    }
                                                }
                                                if (result3 === null) {
                                                    if (input.charCodeAt(pos) === 114) {
                                                        result3 = "r";
                                                        pos++;
                                                    } else {
                                                        result3 = null;
                                                        if (reportFailures === 0) {
                                                            matchFailed("\"r\"");
                                                        }
                                                    }
                                                    if (result3 === null) {
                                                        if (input.charCodeAt(pos) === 116) {
                                                            result3 = "t";
                                                            pos++;
                                                        } else {
                                                            result3 = null;
                                                            if (reportFailures === 0) {
                                                                matchFailed("\"t\"");
                                                            }
                                                        }
                                                        if (result3 === null) {
                                                            pos3 = pos;
                                                            if (input.charCodeAt(pos) === 117) {
                                                                result3 = "u";
                                                                pos++;
                                                            } else {
                                                                result3 = null;
                                                                if (reportFailures === 0) {
                                                                    matchFailed("\"u\"");
                                                                }
                                                            }
                                                            if (result3 !== null) {
                                                                result4 = parse_hex();
                                                                if (result4 !== null) {
                                                                    result5 = parse_hex();
                                                                    if (result5 !== null) {
                                                                        result6 = parse_hex();
                                                                        if (result6 !== null) {
                                                                            result7 = parse_hex();
                                                                            if (result7 !== null) {
                                                                                result3 = [result3, result4, result5, result6, result7];
                                                                            } else {
                                                                                result3 = null;
                                                                                pos = pos3;
                                                                            }
                                                                        } else {
                                                                            result3 = null;
                                                                            pos = pos3;
                                                                        }
                                                                    } else {
                                                                        result3 = null;
                                                                        pos = pos3;
                                                                    }
                                                                } else {
                                                                    result3 = null;
                                                                    pos = pos3;
                                                                }
                                                            } else {
                                                                result3 = null;
                                                                pos = pos3;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        } else {
                            result2 = null;
                            pos = pos2;
                        }
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        if (/^[\0-!#-\\^-\uFFFF]/.test(input.charAt(pos))) {
                            result2 = input.charAt(pos);
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("[\\0-!#-\\\\^-\\uFFFF]");
                            }
                        }
                        if (result2 === null) {
                            pos2 = pos;
                            if (input.charCodeAt(pos) === 92) {
                                result2 = "\\";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"\\\\\"");
                                }
                            }
                            if (result2 !== null) {
                                if (input.charCodeAt(pos) === 34) {
                                    result3 = "\"";
                                    pos++;
                                } else {
                                    result3 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"\\\"\"");
                                    }
                                }
                                if (result3 === null) {
                                    if (input.charCodeAt(pos) === 92) {
                                        result3 = "\\";
                                        pos++;
                                    } else {
                                        result3 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\"\\\\\"");
                                        }
                                    }
                                    if (result3 === null) {
                                        if (input.charCodeAt(pos) === 47) {
                                            result3 = "/";
                                            pos++;
                                        } else {
                                            result3 = null;
                                            if (reportFailures === 0) {
                                                matchFailed("\"/\"");
                                            }
                                        }
                                        if (result3 === null) {
                                            if (input.charCodeAt(pos) === 98) {
                                                result3 = "b";
                                                pos++;
                                            } else {
                                                result3 = null;
                                                if (reportFailures === 0) {
                                                    matchFailed("\"b\"");
                                                }
                                            }
                                            if (result3 === null) {
                                                if (input.charCodeAt(pos) === 102) {
                                                    result3 = "f";
                                                    pos++;
                                                } else {
                                                    result3 = null;
                                                    if (reportFailures === 0) {
                                                        matchFailed("\"f\"");
                                                    }
                                                }
                                                if (result3 === null) {
                                                    if (input.charCodeAt(pos) === 110) {
                                                        result3 = "n";
                                                        pos++;
                                                    } else {
                                                        result3 = null;
                                                        if (reportFailures === 0) {
                                                            matchFailed("\"n\"");
                                                        }
                                                    }
                                                    if (result3 === null) {
                                                        if (input.charCodeAt(pos) === 114) {
                                                            result3 = "r";
                                                            pos++;
                                                        } else {
                                                            result3 = null;
                                                            if (reportFailures === 0) {
                                                                matchFailed("\"r\"");
                                                            }
                                                        }
                                                        if (result3 === null) {
                                                            if (input.charCodeAt(pos) === 116) {
                                                                result3 = "t";
                                                                pos++;
                                                            } else {
                                                                result3 = null;
                                                                if (reportFailures === 0) {
                                                                    matchFailed("\"t\"");
                                                                }
                                                            }
                                                            if (result3 === null) {
                                                                pos3 = pos;
                                                                if (input.charCodeAt(pos) === 117) {
                                                                    result3 = "u";
                                                                    pos++;
                                                                } else {
                                                                    result3 = null;
                                                                    if (reportFailures === 0) {
                                                                        matchFailed("\"u\"");
                                                                    }
                                                                }
                                                                if (result3 !== null) {
                                                                    result4 = parse_hex();
                                                                    if (result4 !== null) {
                                                                        result5 = parse_hex();
                                                                        if (result5 !== null) {
                                                                            result6 = parse_hex();
                                                                            if (result6 !== null) {
                                                                                result7 = parse_hex();
                                                                                if (result7 !== null) {
                                                                                    result3 = [result3, result4, result5, result6, result7];
                                                                                } else {
                                                                                    result3 = null;
                                                                                    pos = pos3;
                                                                                }
                                                                            } else {
                                                                                result3 = null;
                                                                                pos = pos3;
                                                                            }
                                                                        } else {
                                                                            result3 = null;
                                                                            pos = pos3;
                                                                        }
                                                                    } else {
                                                                        result3 = null;
                                                                        pos = pos3;
                                                                    }
                                                                } else {
                                                                    result3 = null;
                                                                    pos = pos3;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (result3 !== null) {
                                    result2 = [result2, result3];
                                } else {
                                    result2 = null;
                                    pos = pos2;
                                }
                            } else {
                                result2 = null;
                                pos = pos2;
                            }
                        }
                    }
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 34) {
                            result2 = "\"";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"\\\"\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return JSON.parse(toString(a));
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_array() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 91) {
                    result0 = "[";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"[\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_values();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 93) {
                            result2 = "]";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"]\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("array", a);
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_values() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2, pos3;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_conditional();
                result0 = result0 !== null ? result0: "";
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    pos3 = pos;
                    if (input.charCodeAt(pos) === 44) {
                        result2 = ",";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\",\"");
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_conditional();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                    } else {
                        result2 = null;
                        pos = pos3;
                    }
                    if (result2 !== null) {
                        result2 = (function(offset, b) {
                            return b;
                        })(pos2, result2[1]);
                    }
                    if (result2 === null) {
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        pos3 = pos;
                        if (input.charCodeAt(pos) === 44) {
                            result2 = ",";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\",\"");
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_conditional();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos3;
                            }
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                        if (result2 !== null) {
                            result2 = (function(offset, b) {
                                return b;
                            })(pos2, result2[1]);
                        }
                        if (result2 === null) {
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, first, args) {
                        if (first != "") {
                            args.unshift(first);
                        }
                        return args;
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_object() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 123) {
                    result0 = "{";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"{\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_keyvalues();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 125) {
                            result2 = "}";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"}\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("object", a);
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_keyvalue() {
                var result0, result1, result2, result3, result4;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_s();
                if (result0 !== null) {
                    result1 = parse_string();
                    if (result1 !== null) {
                        result2 = parse_s();
                        if (result2 !== null) {
                            if (input.charCodeAt(pos) === 58) {
                                result3 = ":";
                                pos++;
                            } else {
                                result3 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\":\"");
                                }
                            }
                            if (result3 !== null) {
                                result4 = parse_conditional();
                                if (result4 !== null) {
                                    result0 = [result0, result1, result2, result3, result4];
                                } else {
                                    result0 = null;
                                    pos = pos1;
                                }
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return [a, b];
                    })(pos0, result0[1], result0[4]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_keyvalues() {
                var result0, result1, result2, result3;
                var pos0, pos1, pos2, pos3;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_keyvalue();
                result0 = result0 !== null ? result0: "";
                if (result0 !== null) {
                    result1 = [];
                    pos2 = pos;
                    pos3 = pos;
                    if (input.charCodeAt(pos) === 44) {
                        result2 = ",";
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("\",\"");
                        }
                    }
                    if (result2 !== null) {
                        result3 = parse_keyvalue();
                        if (result3 !== null) {
                            result2 = [result2, result3];
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                    } else {
                        result2 = null;
                        pos = pos3;
                    }
                    if (result2 !== null) {
                        result2 = (function(offset, b) {
                            return b;
                        })(pos2, result2[1]);
                    }
                    if (result2 === null) {
                        pos = pos2;
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        pos2 = pos;
                        pos3 = pos;
                        if (input.charCodeAt(pos) === 44) {
                            result2 = ",";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\",\"");
                            }
                        }
                        if (result2 !== null) {
                            result3 = parse_keyvalue();
                            if (result3 !== null) {
                                result2 = [result2, result3];
                            } else {
                                result2 = null;
                                pos = pos3;
                            }
                        } else {
                            result2 = null;
                            pos = pos3;
                        }
                        if (result2 !== null) {
                            result2 = (function(offset, b) {
                                return b;
                            })(pos2, result2[1]);
                        }
                        if (result2 === null) {
                            pos = pos2;
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, first, rest) {
                        if (first) {
                            rest.unshift(first);
                        }
                        return rest;
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_ref() {
                var result0, result1;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.substr(pos, 2) === "//") {
                    result0 = "//";
                    pos += 2;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"//\"");
                    }
                }
                if (result0 === null) {
                    if (input.charCodeAt(pos) === 47) {
                        result0 = "/";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"/\"");
                        }
                    }
                    if (result0 === null) {
                        if (input.charCodeAt(pos) === 36) {
                            result0 = "$";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"$\"");
                            }
                        }
                        if (result0 === null) {
                            if (input.substr(pos, 2) === "**") {
                                result0 = "**";
                                pos += 2;
                            } else {
                                result0 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"**\"");
                                }
                            }
                            if (result0 === null) {
                                if (input.charCodeAt(pos) === 42) {
                                    result0 = "*";
                                    pos++;
                                } else {
                                    result0 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"*\"");
                                    }
                                }
                                if (result0 === null) {
                                    if (input.substr(pos, 2) === "..") {
                                        result0 = "..";
                                        pos += 2;
                                    } else {
                                        result0 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\"..\"");
                                        }
                                    }
                                    if (result0 === null) {
                                        if (input.charCodeAt(pos) === 46) {
                                            result0 = ".";
                                            pos++;
                                        } else {
                                            result0 = null;
                                            if (reportFailures === 0) {
                                                matchFailed("\".\"");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (result0 !== null) {
                    result1 = parse_slashProperty();
                    result1 = result1 !== null ? result1: "";
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        e = expr(a);
                        if (b) {
                            b.args.unshift(e);
                            e = b;
                        }
                        return e;
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    result0 = parse_id();
                    if (result0 !== null) {
                        result0 = (function(offset, a) {
                            return expr("ref", [a]);
                        })(pos0, result0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                }
                return result0;
            }
            function parse_id() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (/^[a-z_]/.test(input.charAt(pos))) {
                    result1 = input.charAt(pos);
                    pos++;
                } else {
                    result1 = null;
                    if (reportFailures === 0) {
                        matchFailed("[a-z_]");
                    }
                }
                if (result1 !== null) {
                    result0 = [];
                    while (result1 !== null) {
                        result0.push(result1);
                        if (/^[a-z_]/.test(input.charAt(pos))) {
                            result1 = input.charAt(pos);
                            pos++;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("[a-z_]");
                            }
                        }
                    }
                } else {
                    result0 = null;
                }
                if (result0 !== null) {
                    result1 = [];
                    if (/^[a-z_0-9]/.test(input.charAt(pos))) {
                        result2 = input.charAt(pos);
                        pos++;
                    } else {
                        result2 = null;
                        if (reportFailures === 0) {
                            matchFailed("[a-z_0-9]");
                        }
                    }
                    while (result2 !== null) {
                        result1.push(result2);
                        if (/^[a-z_0-9]/.test(input.charAt(pos))) {
                            result2 = input.charAt(pos);
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("[a-z_0-9]");
                            }
                        }
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return a.join('') + b.join('');
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_property() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 47) {
                    result0 = "/";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"/\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_slashProperty();
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a;
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    pos1 = pos;
                    if (input.charCodeAt(pos) === 123) {
                        result0 = "{";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"{\"");
                        }
                    }
                    if (result0 !== null) {
                        result1 = parse_conditional();
                        if (result1 !== null) {
                            if (input.charCodeAt(pos) === 125) {
                                result2 = "}";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"}\"");
                                }
                            }
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function(offset, a) {
                            return expr("{}", [a]);
                        })(pos0, result0[1]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        pos0 = pos;
                        pos1 = pos;
                        if (input.charCodeAt(pos) === 91) {
                            result0 = "[";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"[\"");
                            }
                        }
                        if (result0 !== null) {
                            result1 = parse_conditional();
                            if (result1 !== null) {
                                if (input.charCodeAt(pos) === 93) {
                                    result2 = "]";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\"]\"");
                                    }
                                }
                                if (result2 !== null) {
                                    result0 = [result0, result1, result2];
                                } else {
                                    result0 = null;
                                    pos = pos1;
                                }
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                        if (result0 !== null) {
                            result0 = (function(offset, a) {
                                return expr("[]", [a]);
                            })(pos0, result0[1]);
                        }
                        if (result0 === null) {
                            pos = pos0;
                        }
                    }
                }
                return result0;
            }
            function parse_slashProperty() {
                var result0;
                var pos0;
                pos0 = pos;
                result0 = parse_id();
                if (result0 === null) {
                    result0 = parse_number();
                    if (result0 === null) {
                        result0 = parse_string();
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("/", [a]);
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    if (input.substr(pos, 2) === "..") {
                        result0 = "..";
                        pos += 2;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"..\"");
                        }
                    }
                    if (result0 === null) {
                        if (input.charCodeAt(pos) === 42) {
                            result0 = "*";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"*\"");
                            }
                        }
                    }
                    if (result0 !== null) {
                        result0 = (function(offset, a) {
                            return expr(a, []);
                        })(pos0, result0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                }
                return result0;
            }
            function parse_s() {
                var result0, result1;
                var pos0;
                reportFailures++;
                pos0 = pos;
                result0 = [];
                if (/^[ ]/.test(input.charAt(pos))) {
                    result1 = input.charAt(pos);
                    pos++;
                } else {
                    result1 = null;
                    if (reportFailures === 0) {
                        matchFailed("[ ]");
                    }
                }
                while (result1 !== null) {
                    result0.push(result1);
                    if (/^[ ]/.test(input.charAt(pos))) {
                        result1 = input.charAt(pos);
                        pos++;
                    } else {
                        result1 = null;
                        if (reportFailures === 0) {
                            matchFailed("[ ]");
                        }
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset) {
                        return '';
                    })(pos0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                reportFailures--;
                if (reportFailures === 0 && result0 === null) {
                    matchFailed("space");
                }
                return result0;
            }
            function parse_path() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_root();
                if (result0 !== null) {
                    result1 = [];
                    result2 = parse_step();
                    while (result2 !== null) {
                        result1.push(result2);
                        result2 = parse_step();
                    }
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        while (b.length) {
                            a = joinPath(a, b.shift());
                        }
                        return a;
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                return result0;
            }
            function parse_root() {
                var result0, result1;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                result0 = parse_implicitDotRoot();
                if (result0 !== null) {
                    result1 = parse_dotStep();
                    result1 = result1 !== null ? result1: "";
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a, b) {
                        return joinPath(a, b);
                    })(pos0, result0[0], result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    result0 = parse_explicitDotRoot();
                }
                return result0;
            }
            function parse_step() {
                var result0, result1;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 46) {
                    result0 = ".";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\".\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_dotStep();
                    if (result1 !== null) {
                        result0 = [result0, result1];
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return a;
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    result0 = parse_noDotStep();
                }
                return result0;
            }
            function parse_implicitDotRoot() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                if (input.charCodeAt(pos) === 47) {
                    result0 = "/";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"/\"");
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset) {
                        return expr("root");
                    })(pos0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    if (input.charCodeAt(pos) === 64) {
                        result0 = "@";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"@\"");
                        }
                    }
                    if (result0 !== null) {
                        result0 = (function(offset) {
                            return expr("this");
                        })(pos0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        pos0 = pos;
                        pos1 = pos;
                        if (input.charCodeAt(pos) === 46) {
                            result0 = ".";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\".\"");
                            }
                        }
                        if (result0 !== null) {
                            if (input.charCodeAt(pos) === 46) {
                                result2 = ".";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\".\"");
                                }
                            }
                            if (result2 !== null) {
                                result1 = [];
                                while (result2 !== null) {
                                    result1.push(result2);
                                    if (input.charCodeAt(pos) === 46) {
                                        result2 = ".";
                                        pos++;
                                    } else {
                                        result2 = null;
                                        if (reportFailures === 0) {
                                            matchFailed("\".\"");
                                        }
                                    }
                                }
                            } else {
                                result1 = null;
                            }
                            if (result1 !== null) {
                                result0 = [result0, result1];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                        if (result0 !== null) {
                            result0 = (function(offset, a) {
                                return expr("ancestor", [a.length]);
                            })(pos0, result0[1]);
                        }
                        if (result0 === null) {
                            pos = pos0;
                        }
                    }
                }
                return result0;
            }
            function parse_explicitDotRoot() {
                var result0;
                var pos0;
                pos0 = pos;
                result0 = parse_id();
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("ref", [a]);
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    if (input.charCodeAt(pos) === 42) {
                        result0 = "*";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"*\"");
                        }
                    }
                    if (result0 !== null) {
                        result0 = (function(offset) {
                            return expr("values", []);
                        })(pos0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                }
                return result0;
            }
            function parse_dotStep() {
                var result0;
                var pos0;
                pos0 = pos;
                result0 = parse_id();
                if (result0 === null) {
                    result0 = parse_string();
                    if (result0 === null) {
                        result0 = parse_number();
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("get", [a]);
                    })(pos0, result0);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    if (input.charCodeAt(pos) === 42) {
                        result0 = "*";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"*\"");
                        }
                    }
                    if (result0 !== null) {
                        result0 = (function(offset) {
                            return expr("values", []);
                        })(pos0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                }
                return result0;
            }
            function parse_noDotStep() {
                var result0, result1, result2;
                var pos0, pos1;
                pos0 = pos;
                pos1 = pos;
                if (input.charCodeAt(pos) === 123) {
                    result0 = "{";
                    pos++;
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"{\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_conditional();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos) === 125) {
                            result2 = "}";
                            pos++;
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"}\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                } else {
                    result0 = null;
                    pos = pos1;
                }
                if (result0 !== null) {
                    result0 = (function(offset, a) {
                        return expr("eval", [a]);
                    })(pos0, result0[1]);
                }
                if (result0 === null) {
                    pos = pos0;
                }
                if (result0 === null) {
                    pos0 = pos;
                    pos1 = pos;
                    if (input.charCodeAt(pos) === 91) {
                        result0 = "[";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"[\"");
                        }
                    }
                    if (result0 !== null) {
                        result1 = parse_conditional();
                        if (result1 !== null) {
                            if (input.charCodeAt(pos) === 93) {
                                result2 = "]";
                                pos++;
                            } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                    matchFailed("\"]\"");
                                }
                            }
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function(offset, a) {
                            return expr("pred", [a]);
                        })(pos0, result0[1]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        pos0 = pos;
                        pos1 = pos;
                        if (input.charCodeAt(pos) === 40) {
                            result0 = "(";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"(\"");
                            }
                        }
                        if (result0 !== null) {
                            result1 = parse_values();
                            if (result1 !== null) {
                                if (input.charCodeAt(pos) === 41) {
                                    result2 = ")";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\")\"");
                                    }
                                }
                                if (result2 !== null) {
                                    result0 = [result0, result1, result2];
                                } else {
                                    result0 = null;
                                    pos = pos1;
                                }
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                        if (result0 !== null) {
                            result0 = (function(offset, a) {
                                return expr("call", [a]);
                            })(pos0, result0[1]);
                        }
                        if (result0 === null) {
                            pos = pos0;
                        }
                    }
                }
                return result0;
            }
            function cleanupExpected(expected) {
                expected.sort();
                var lastExpected = null;
                var cleanExpected = [];
                for (var i = 0; i < expected.length; i++) {
                    if (expected[i] !== lastExpected) {
                        cleanExpected.push(expected[i]);
                        lastExpected = expected[i];
                    }
                }
                return cleanExpected;
            }
            function computeErrorPosition() {
                /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
                var line = 1;
                var column = 1;
                var seenCR = false;
                for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
                    var ch = input.charAt(i);
                    if (ch === "\n") {
                        if (!seenCR) {
                            line++;
                        }
                        column = 1;
                        seenCR = false;
                    } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                        line++;
                        column = 1;
                        seenCR = true;
                    } else {
                        column++;
                        seenCR = false;
                    }
                }
                return {
                    line: line,
                    column: column
                };
            }
            //  shorthand to create a new expression
            function expr(op, args) {
                return new glass.Expression(op, args);
            }
            //  left associates operations
            function joinLeft(e, arrayOfOps) {
                while (arrayOfOps.length > 0) {
                    array = arrayOfOps.shift();
                    e = expr(array[0], [e, array[1]]);
                }
                return e;
            }
            function unaryRight(ops, e) {
                while (ops.length > 0) {
                    e = expr(ops.pop(), [e]);
                }
                return e;
            }
            function toString(array) {
                if (Array.isArray(array)) {
                    for (var i = 0; i < array.length; i++) array[i] = toString(array[i]);
                    return array.join('');
                }
                return array;
            }
            function joinPath(left, right) {
                if (right) {
                    right.args.unshift(left);
                    left = right;
                }
                return left;
            }
            var result = parseFunctions[startRule]();
            /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
            if (result === null || pos !== input.length) {
                var offset = Math.max(pos, rightmostFailuresPos);
                var found = offset < input.length ? input.charAt(offset) : null;
                var errorPosition = computeErrorPosition();
                throw new this.SyntaxError(cleanupExpected(rightmostFailuresExpected), found, offset, errorPosition.line, errorPosition.column);
            }
            return result;
        },
        toSource: function() {
            return this._source;
        },
        SyntaxError: function(expected, found, offset, line, column) {
            function buildMessage(expected, found) {
                var expectedHumanized, foundHumanized;
                switch (expected.length) {
                case 0:
                    expectedHumanized = "end of input";
                    break;
                case 1:
                    expectedHumanized = expected[0];
                    break;
                default:
                    expectedHumanized = expected.slice(0, expected.length - 1).join(", ") + " or " + expected[expected.length - 1];
                }
                foundHumanized = found ? quote(found) : "end of input";
                return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
            }
            this.name = "SyntaxError";
            this.expected = expected;
            this.found = found;
            this.message = buildMessage(expected, found);
            this.offset = offset;
            this.line = line;
            this.column = column;
        },
        _source: "(function(){\n  /*\n   * Generated by PEG.js 0.7.0.\n   *\n   * http://pegjs.majda.cz/\n   */\n  \n  function quote(s) {\n    /*\n     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a\n     * string literal except for the closing quote character, backslash,\n     * carriage return, line separator, paragraph separator, and line feed.\n     * Any character may appear in the form of an escape sequence.\n     *\n     * For portability, we also escape escape all control and non-ASCII\n     * characters. Note that \"\\0\" and \"\\v\" escape sequences are not used\n     * because JSHint does not like the first and IE the second.\n     */\n     return '\"' + s\n      .replace(/\\\\/g, '\\\\\\\\')  // backslash\n      .replace(/\"/g, '\\\\\"')    // closing quote character\n      .replace(/\\x08/g, '\\\\b') // backspace\n      .replace(/\\t/g, '\\\\t')   // horizontal tab\n      .replace(/\\n/g, '\\\\n')   // line feed\n      .replace(/\\f/g, '\\\\f')   // form feed\n      .replace(/\\r/g, '\\\\r')   // carriage return\n      .replace(/[\\x00-\\x07\\x0B\\x0E-\\x1F\\x80-\\uFFFF]/g, escape)\n      + '\"';\n  }\n  \n  var result = {\n    /*\n     * Parses the input with a generated parser. If the parsing is successfull,\n     * returns a value explicitly or implicitly specified by the grammar from\n     * which the parser was generated (see |PEG.buildParser|). If the parsing is\n     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.\n     */\n    parse: function(input, startRule) {\n      var parseFunctions = {\n        \"conditional\": parse_conditional,\n        \"or\": parse_or,\n        \"and\": parse_and,\n        \"equality\": parse_equality,\n        \"rel\": parse_rel,\n        \"sum\": parse_sum,\n        \"product\": parse_product,\n        \"not\": parse_not,\n        \"primary\": parse_primary,\n        \"group\": parse_group,\n        \"literal\": parse_literal,\n        \"boolean\": parse_boolean,\n        \"number\": parse_number,\n        \"hex\": parse_hex,\n        \"string\": parse_string,\n        \"array\": parse_array,\n        \"values\": parse_values,\n        \"object\": parse_object,\n        \"keyvalue\": parse_keyvalue,\n        \"keyvalues\": parse_keyvalues,\n        \"ref\": parse_ref,\n        \"id\": parse_id,\n        \"property\": parse_property,\n        \"slashProperty\": parse_slashProperty,\n        \"s\": parse_s,\n        \"path\": parse_path,\n        \"root\": parse_root,\n        \"step\": parse_step,\n        \"implicitDotRoot\": parse_implicitDotRoot,\n        \"explicitDotRoot\": parse_explicitDotRoot,\n        \"dotStep\": parse_dotStep,\n        \"noDotStep\": parse_noDotStep\n      };\n      \n      if (startRule !== undefined) {\n        if (parseFunctions[startRule] === undefined) {\n          throw new Error(\"Invalid rule name: \" + quote(startRule) + \".\");\n        }\n      } else {\n        startRule = \"conditional\";\n      }\n      \n      var pos = 0;\n      var reportFailures = 0;\n      var rightmostFailuresPos = 0;\n      var rightmostFailuresExpected = [];\n      \n      function padLeft(input, padding, length) {\n        var result = input;\n        \n        var padLength = length - input.length;\n        for (var i = 0; i < padLength; i++) {\n          result = padding + result;\n        }\n        \n        return result;\n      }\n      \n      function escape(ch) {\n        var charCode = ch.charCodeAt(0);\n        var escapeChar;\n        var length;\n        \n        if (charCode <= 0xFF) {\n          escapeChar = 'x';\n          length = 2;\n        } else {\n          escapeChar = 'u';\n          length = 4;\n        }\n        \n        return '\\\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);\n      }\n      \n      function matchFailed(failure) {\n        if (pos < rightmostFailuresPos) {\n          return;\n        }\n        \n        if (pos > rightmostFailuresPos) {\n          rightmostFailuresPos = pos;\n          rightmostFailuresExpected = [];\n        }\n        \n        rightmostFailuresExpected.push(failure);\n      }\n      \n      function parse_conditional() {\n        var result0, result1, result2, result3, result4, result5;\n        var pos0, pos1, pos2, pos3;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_or();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          pos3 = pos;\n          if (input.charCodeAt(pos) === 63) {\n            result2 = \"?\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"?\\\"\");\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_conditional();\n            if (result3 !== null) {\n              if (input.charCodeAt(pos) === 58) {\n                result4 = \":\";\n                pos++;\n              } else {\n                result4 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\":\\\"\");\n                }\n              }\n              if (result4 !== null) {\n                result5 = parse_conditional();\n                if (result5 !== null) {\n                  result2 = [result2, result3, result4, result5];\n                } else {\n                  result2 = null;\n                  pos = pos3;\n                }\n              } else {\n                result2 = null;\n                pos = pos3;\n              }\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n          } else {\n            result2 = null;\n            pos = pos3;\n          }\n          if (result2 !== null) {\n            result2 = (function(offset, b, c) {return [b,c];})(pos2, result2[1], result2[3]);\n          }\n          if (result2 === null) {\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            pos3 = pos;\n            if (input.charCodeAt(pos) === 63) {\n              result2 = \"?\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"?\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_conditional();\n              if (result3 !== null) {\n                if (input.charCodeAt(pos) === 58) {\n                  result4 = \":\";\n                  pos++;\n                } else {\n                  result4 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\":\\\"\");\n                  }\n                }\n                if (result4 !== null) {\n                  result5 = parse_conditional();\n                  if (result5 !== null) {\n                    result2 = [result2, result3, result4, result5];\n                  } else {\n                    result2 = null;\n                    pos = pos3;\n                  }\n                } else {\n                  result2 = null;\n                  pos = pos3;\n                }\n              } else {\n                result2 = null;\n                pos = pos3;\n              }\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n            if (result2 !== null) {\n              result2 = (function(offset, b, c) {return [b,c];})(pos2, result2[1], result2[3]);\n            }\n            if (result2 === null) {\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, e, args) {\r\n                while (args.length > 0) {\r\n                    e = expr(\"?:\", [e].concat(args.pop()));\r\n                }\r\n                return e;\r\n            })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_or() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_and();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.substr(pos, 2) === \"or\") {\n            result2 = \"or\";\n            pos += 2;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"or\\\"\");\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_and();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.substr(pos, 2) === \"or\") {\n              result2 = \"or\";\n              pos += 2;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"or\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_and();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_and() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_equality();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.substr(pos, 3) === \"and\") {\n            result2 = \"and\";\n            pos += 3;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"and\\\"\");\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_equality();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.substr(pos, 3) === \"and\") {\n              result2 = \"and\";\n              pos += 3;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"and\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_equality();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_equality() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_rel();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.substr(pos, 2) === \"==\") {\n            result2 = \"==\";\n            pos += 2;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"==\\\"\");\n            }\n          }\n          if (result2 === null) {\n            if (input.substr(pos, 2) === \"!=\") {\n              result2 = \"!=\";\n              pos += 2;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"!=\\\"\");\n              }\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_rel();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.substr(pos, 2) === \"==\") {\n              result2 = \"==\";\n              pos += 2;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"==\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.substr(pos, 2) === \"!=\") {\n                result2 = \"!=\";\n                pos += 2;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"!=\\\"\");\n                }\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_rel();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_rel() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_sum();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.substr(pos, 2) === \"<=\") {\n            result2 = \"<=\";\n            pos += 2;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"<=\\\"\");\n            }\n          }\n          if (result2 === null) {\n            if (input.substr(pos, 2) === \">=\") {\n              result2 = \">=\";\n              pos += 2;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\">=\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.charCodeAt(pos) === 60) {\n                result2 = \"<\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"<\\\"\");\n                }\n              }\n              if (result2 === null) {\n                if (input.charCodeAt(pos) === 62) {\n                  result2 = \">\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\">\\\"\");\n                  }\n                }\n              }\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_sum();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.substr(pos, 2) === \"<=\") {\n              result2 = \"<=\";\n              pos += 2;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"<=\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.substr(pos, 2) === \">=\") {\n                result2 = \">=\";\n                pos += 2;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\">=\\\"\");\n                }\n              }\n              if (result2 === null) {\n                if (input.charCodeAt(pos) === 60) {\n                  result2 = \"<\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"<\\\"\");\n                  }\n                }\n                if (result2 === null) {\n                  if (input.charCodeAt(pos) === 62) {\n                    result2 = \">\";\n                    pos++;\n                  } else {\n                    result2 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\">\\\"\");\n                    }\n                  }\n                }\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_sum();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_sum() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_product();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.charCodeAt(pos) === 43) {\n            result2 = \"+\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"+\\\"\");\n            }\n          }\n          if (result2 === null) {\n            if (input.charCodeAt(pos) === 45) {\n              result2 = \"-\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"-\\\"\");\n              }\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_product();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.charCodeAt(pos) === 43) {\n              result2 = \"+\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"+\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.charCodeAt(pos) === 45) {\n                result2 = \"-\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"-\\\"\");\n                }\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_product();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_product() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_not();\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          if (input.charCodeAt(pos) === 42) {\n            result2 = \"*\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"*\\\"\");\n            }\n          }\n          if (result2 === null) {\n            if (input.substr(pos, 3) === \"div\") {\n              result2 = \"div\";\n              pos += 3;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"div\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.substr(pos, 3) === \"mod\") {\n                result2 = \"mod\";\n                pos += 3;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"mod\\\"\");\n                }\n              }\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_not();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          } else {\n            result2 = null;\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            if (input.charCodeAt(pos) === 42) {\n              result2 = \"*\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"*\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.substr(pos, 3) === \"div\") {\n                result2 = \"div\";\n                pos += 3;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"div\\\"\");\n                }\n              }\n              if (result2 === null) {\n                if (input.substr(pos, 3) === \"mod\") {\n                  result2 = \"mod\";\n                  pos += 3;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"mod\\\"\");\n                  }\n                }\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_not();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinLeft(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_not() {\n        var result0, result1, result2;\n        var pos0, pos1, pos2, pos3;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = [];\n        pos2 = pos;\n        pos3 = pos;\n        result1 = parse_s();\n        if (result1 !== null) {\n          if (input.charCodeAt(pos) === 33) {\n            result2 = \"!\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"!\\\"\");\n            }\n          }\n          if (result2 === null) {\n            if (input.charCodeAt(pos) === 126) {\n              result2 = \"~\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"~\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.charCodeAt(pos) === 43) {\n                result2 = \"+\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"+\\\"\");\n                }\n              }\n              if (result2 === null) {\n                if (input.charCodeAt(pos) === 45) {\n                  result2 = \"-\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"-\\\"\");\n                  }\n                }\n              }\n            }\n          }\n          if (result2 !== null) {\n            result1 = [result1, result2];\n          } else {\n            result1 = null;\n            pos = pos3;\n          }\n        } else {\n          result1 = null;\n          pos = pos3;\n        }\n        if (result1 !== null) {\n          result1 = (function(offset, op) { return op; })(pos2, result1[1]);\n        }\n        if (result1 === null) {\n          pos = pos2;\n        }\n        while (result1 !== null) {\n          result0.push(result1);\n          pos2 = pos;\n          pos3 = pos;\n          result1 = parse_s();\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 33) {\n              result2 = \"!\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"!\\\"\");\n              }\n            }\n            if (result2 === null) {\n              if (input.charCodeAt(pos) === 126) {\n                result2 = \"~\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"~\\\"\");\n                }\n              }\n              if (result2 === null) {\n                if (input.charCodeAt(pos) === 43) {\n                  result2 = \"+\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"+\\\"\");\n                  }\n                }\n                if (result2 === null) {\n                  if (input.charCodeAt(pos) === 45) {\n                    result2 = \"-\";\n                    pos++;\n                  } else {\n                    result2 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\"-\\\"\");\n                    }\n                  }\n                }\n              }\n            }\n            if (result2 !== null) {\n              result1 = [result1, result2];\n            } else {\n              result1 = null;\n              pos = pos3;\n            }\n          } else {\n            result1 = null;\n            pos = pos3;\n          }\n          if (result1 !== null) {\n            result1 = (function(offset, op) { return op; })(pos2, result1[1]);\n          }\n          if (result1 === null) {\n            pos = pos2;\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_primary();\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, ops, b) { return unaryRight(ops,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_primary() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_s();\n        if (result0 !== null) {\n          result1 = parse_group();\n          if (result1 === null) {\n            result1 = parse_literal();\n            if (result1 === null) {\n              result1 = parse_path();\n            }\n          }\n          if (result1 !== null) {\n            result2 = parse_s();\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a; })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_group() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 40) {\n          result0 = \"(\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"(\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_conditional();\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 41) {\n              result2 = \")\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\")\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a; })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_literal() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_s();\n        if (result0 !== null) {\n          result1 = parse_boolean();\n          if (result1 === null) {\n            result1 = parse_number();\n            if (result1 === null) {\n              result1 = parse_string();\n              if (result1 === null) {\n                result1 = parse_array();\n                if (result1 === null) {\n                  result1 = parse_object();\n                }\n              }\n            }\n          }\n          if (result1 !== null) {\n            result2 = parse_s();\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a; })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_boolean() {\n        var result0;\n        var pos0;\n        \n        pos0 = pos;\n        if (input.substr(pos, 4) === \"true\") {\n          result0 = \"true\";\n          pos += 4;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"true\\\"\");\n          }\n        }\n        if (result0 === null) {\n          if (input.substr(pos, 5) === \"false\") {\n            result0 = \"false\";\n            pos += 5;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"false\\\"\");\n            }\n          }\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a == \"true\"; })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_number() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (/^[0-9]/.test(input.charAt(pos))) {\n          result1 = input.charAt(pos);\n          pos++;\n        } else {\n          result1 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"[0-9]\");\n          }\n        }\n        if (result1 !== null) {\n          result0 = [];\n          while (result1 !== null) {\n            result0.push(result1);\n            if (/^[0-9]/.test(input.charAt(pos))) {\n              result1 = input.charAt(pos);\n              pos++;\n            } else {\n              result1 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"[0-9]\");\n              }\n            }\n          }\n        } else {\n          result0 = null;\n        }\n        if (result0 !== null) {\n          pos2 = pos;\n          if (input.charCodeAt(pos) === 46) {\n            result1 = \".\";\n            pos++;\n          } else {\n            result1 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\".\\\"\");\n            }\n          }\n          if (result1 !== null) {\n            if (/^[0-9]/.test(input.charAt(pos))) {\n              result3 = input.charAt(pos);\n              pos++;\n            } else {\n              result3 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"[0-9]\");\n              }\n            }\n            if (result3 !== null) {\n              result2 = [];\n              while (result3 !== null) {\n                result2.push(result3);\n                if (/^[0-9]/.test(input.charAt(pos))) {\n                  result3 = input.charAt(pos);\n                  pos++;\n                } else {\n                  result3 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"[0-9]\");\n                  }\n                }\n              }\n            } else {\n              result2 = null;\n            }\n            if (result2 !== null) {\n              result1 = [result1, result2];\n            } else {\n              result1 = null;\n              pos = pos2;\n            }\n          } else {\n            result1 = null;\n            pos = pos2;\n          }\n          result1 = result1 !== null ? result1 : \"\";\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return parseFloat(toString(a)); })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_hex() {\n        var result0;\n        \n        if (/^[a-fA-F0-9]/.test(input.charAt(pos))) {\n          result0 = input.charAt(pos);\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"[a-fA-F0-9]\");\n          }\n        }\n        return result0;\n      }\n      \n      function parse_string() {\n        var result0, result1, result2, result3, result4, result5, result6, result7;\n        var pos0, pos1, pos2, pos3;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 34) {\n          result0 = \"\\\"\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"\\\\\\\"\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = [];\n          if (/^[\\0-!#-\\\\^-\\uFFFF]/.test(input.charAt(pos))) {\n            result2 = input.charAt(pos);\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"[\\\\0-!#-\\\\\\\\^-\\\\uFFFF]\");\n            }\n          }\n          if (result2 === null) {\n            pos2 = pos;\n            if (input.charCodeAt(pos) === 92) {\n              result2 = \"\\\\\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"\\\\\\\\\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              if (input.charCodeAt(pos) === 34) {\n                result3 = \"\\\"\";\n                pos++;\n              } else {\n                result3 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"\\\\\\\"\\\"\");\n                }\n              }\n              if (result3 === null) {\n                if (input.charCodeAt(pos) === 92) {\n                  result3 = \"\\\\\";\n                  pos++;\n                } else {\n                  result3 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"\\\\\\\\\\\"\");\n                  }\n                }\n                if (result3 === null) {\n                  if (input.charCodeAt(pos) === 47) {\n                    result3 = \"/\";\n                    pos++;\n                  } else {\n                    result3 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\"/\\\"\");\n                    }\n                  }\n                  if (result3 === null) {\n                    if (input.charCodeAt(pos) === 98) {\n                      result3 = \"b\";\n                      pos++;\n                    } else {\n                      result3 = null;\n                      if (reportFailures === 0) {\n                        matchFailed(\"\\\"b\\\"\");\n                      }\n                    }\n                    if (result3 === null) {\n                      if (input.charCodeAt(pos) === 102) {\n                        result3 = \"f\";\n                        pos++;\n                      } else {\n                        result3 = null;\n                        if (reportFailures === 0) {\n                          matchFailed(\"\\\"f\\\"\");\n                        }\n                      }\n                      if (result3 === null) {\n                        if (input.charCodeAt(pos) === 110) {\n                          result3 = \"n\";\n                          pos++;\n                        } else {\n                          result3 = null;\n                          if (reportFailures === 0) {\n                            matchFailed(\"\\\"n\\\"\");\n                          }\n                        }\n                        if (result3 === null) {\n                          if (input.charCodeAt(pos) === 114) {\n                            result3 = \"r\";\n                            pos++;\n                          } else {\n                            result3 = null;\n                            if (reportFailures === 0) {\n                              matchFailed(\"\\\"r\\\"\");\n                            }\n                          }\n                          if (result3 === null) {\n                            if (input.charCodeAt(pos) === 116) {\n                              result3 = \"t\";\n                              pos++;\n                            } else {\n                              result3 = null;\n                              if (reportFailures === 0) {\n                                matchFailed(\"\\\"t\\\"\");\n                              }\n                            }\n                            if (result3 === null) {\n                              pos3 = pos;\n                              if (input.charCodeAt(pos) === 117) {\n                                result3 = \"u\";\n                                pos++;\n                              } else {\n                                result3 = null;\n                                if (reportFailures === 0) {\n                                  matchFailed(\"\\\"u\\\"\");\n                                }\n                              }\n                              if (result3 !== null) {\n                                result4 = parse_hex();\n                                if (result4 !== null) {\n                                  result5 = parse_hex();\n                                  if (result5 !== null) {\n                                    result6 = parse_hex();\n                                    if (result6 !== null) {\n                                      result7 = parse_hex();\n                                      if (result7 !== null) {\n                                        result3 = [result3, result4, result5, result6, result7];\n                                      } else {\n                                        result3 = null;\n                                        pos = pos3;\n                                      }\n                                    } else {\n                                      result3 = null;\n                                      pos = pos3;\n                                    }\n                                  } else {\n                                    result3 = null;\n                                    pos = pos3;\n                                  }\n                                } else {\n                                  result3 = null;\n                                  pos = pos3;\n                                }\n                              } else {\n                                result3 = null;\n                                pos = pos3;\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            } else {\n              result2 = null;\n              pos = pos2;\n            }\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            if (/^[\\0-!#-\\\\^-\\uFFFF]/.test(input.charAt(pos))) {\n              result2 = input.charAt(pos);\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"[\\\\0-!#-\\\\\\\\^-\\\\uFFFF]\");\n              }\n            }\n            if (result2 === null) {\n              pos2 = pos;\n              if (input.charCodeAt(pos) === 92) {\n                result2 = \"\\\\\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"\\\\\\\\\\\"\");\n                }\n              }\n              if (result2 !== null) {\n                if (input.charCodeAt(pos) === 34) {\n                  result3 = \"\\\"\";\n                  pos++;\n                } else {\n                  result3 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"\\\\\\\"\\\"\");\n                  }\n                }\n                if (result3 === null) {\n                  if (input.charCodeAt(pos) === 92) {\n                    result3 = \"\\\\\";\n                    pos++;\n                  } else {\n                    result3 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\"\\\\\\\\\\\"\");\n                    }\n                  }\n                  if (result3 === null) {\n                    if (input.charCodeAt(pos) === 47) {\n                      result3 = \"/\";\n                      pos++;\n                    } else {\n                      result3 = null;\n                      if (reportFailures === 0) {\n                        matchFailed(\"\\\"/\\\"\");\n                      }\n                    }\n                    if (result3 === null) {\n                      if (input.charCodeAt(pos) === 98) {\n                        result3 = \"b\";\n                        pos++;\n                      } else {\n                        result3 = null;\n                        if (reportFailures === 0) {\n                          matchFailed(\"\\\"b\\\"\");\n                        }\n                      }\n                      if (result3 === null) {\n                        if (input.charCodeAt(pos) === 102) {\n                          result3 = \"f\";\n                          pos++;\n                        } else {\n                          result3 = null;\n                          if (reportFailures === 0) {\n                            matchFailed(\"\\\"f\\\"\");\n                          }\n                        }\n                        if (result3 === null) {\n                          if (input.charCodeAt(pos) === 110) {\n                            result3 = \"n\";\n                            pos++;\n                          } else {\n                            result3 = null;\n                            if (reportFailures === 0) {\n                              matchFailed(\"\\\"n\\\"\");\n                            }\n                          }\n                          if (result3 === null) {\n                            if (input.charCodeAt(pos) === 114) {\n                              result3 = \"r\";\n                              pos++;\n                            } else {\n                              result3 = null;\n                              if (reportFailures === 0) {\n                                matchFailed(\"\\\"r\\\"\");\n                              }\n                            }\n                            if (result3 === null) {\n                              if (input.charCodeAt(pos) === 116) {\n                                result3 = \"t\";\n                                pos++;\n                              } else {\n                                result3 = null;\n                                if (reportFailures === 0) {\n                                  matchFailed(\"\\\"t\\\"\");\n                                }\n                              }\n                              if (result3 === null) {\n                                pos3 = pos;\n                                if (input.charCodeAt(pos) === 117) {\n                                  result3 = \"u\";\n                                  pos++;\n                                } else {\n                                  result3 = null;\n                                  if (reportFailures === 0) {\n                                    matchFailed(\"\\\"u\\\"\");\n                                  }\n                                }\n                                if (result3 !== null) {\n                                  result4 = parse_hex();\n                                  if (result4 !== null) {\n                                    result5 = parse_hex();\n                                    if (result5 !== null) {\n                                      result6 = parse_hex();\n                                      if (result6 !== null) {\n                                        result7 = parse_hex();\n                                        if (result7 !== null) {\n                                          result3 = [result3, result4, result5, result6, result7];\n                                        } else {\n                                          result3 = null;\n                                          pos = pos3;\n                                        }\n                                      } else {\n                                        result3 = null;\n                                        pos = pos3;\n                                      }\n                                    } else {\n                                      result3 = null;\n                                      pos = pos3;\n                                    }\n                                  } else {\n                                    result3 = null;\n                                    pos = pos3;\n                                  }\n                                } else {\n                                  result3 = null;\n                                  pos = pos3;\n                                }\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n                if (result3 !== null) {\n                  result2 = [result2, result3];\n                } else {\n                  result2 = null;\n                  pos = pos2;\n                }\n              } else {\n                result2 = null;\n                pos = pos2;\n              }\n            }\n          }\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 34) {\n              result2 = \"\\\"\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"\\\\\\\"\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return JSON.parse(toString(a)); })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_array() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 91) {\n          result0 = \"[\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"[\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_values();\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 93) {\n              result2 = \"]\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"]\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"array\", a); })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_values() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2, pos3;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_conditional();\n        result0 = result0 !== null ? result0 : \"\";\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          pos3 = pos;\n          if (input.charCodeAt(pos) === 44) {\n            result2 = \",\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\",\\\"\");\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_conditional();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n          } else {\n            result2 = null;\n            pos = pos3;\n          }\n          if (result2 !== null) {\n            result2 = (function(offset, b) {return b;})(pos2, result2[1]);\n          }\n          if (result2 === null) {\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            pos3 = pos;\n            if (input.charCodeAt(pos) === 44) {\n              result2 = \",\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\",\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_conditional();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos3;\n              }\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n            if (result2 !== null) {\n              result2 = (function(offset, b) {return b;})(pos2, result2[1]);\n            }\n            if (result2 === null) {\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, first, args) {\r\n            if (first != \"\") { args.unshift(first); } return args;\r\n        })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_object() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 123) {\n          result0 = \"{\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"{\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_keyvalues();\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 125) {\n              result2 = \"}\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"}\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"object\", a); })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_keyvalue() {\n        var result0, result1, result2, result3, result4;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_s();\n        if (result0 !== null) {\n          result1 = parse_string();\n          if (result1 !== null) {\n            result2 = parse_s();\n            if (result2 !== null) {\n              if (input.charCodeAt(pos) === 58) {\n                result3 = \":\";\n                pos++;\n              } else {\n                result3 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\":\\\"\");\n                }\n              }\n              if (result3 !== null) {\n                result4 = parse_conditional();\n                if (result4 !== null) {\n                  result0 = [result0, result1, result2, result3, result4];\n                } else {\n                  result0 = null;\n                  pos = pos1;\n                }\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return [a,b]; })(pos0, result0[1], result0[4]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_keyvalues() {\n        var result0, result1, result2, result3;\n        var pos0, pos1, pos2, pos3;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_keyvalue();\n        result0 = result0 !== null ? result0 : \"\";\n        if (result0 !== null) {\n          result1 = [];\n          pos2 = pos;\n          pos3 = pos;\n          if (input.charCodeAt(pos) === 44) {\n            result2 = \",\";\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\",\\\"\");\n            }\n          }\n          if (result2 !== null) {\n            result3 = parse_keyvalue();\n            if (result3 !== null) {\n              result2 = [result2, result3];\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n          } else {\n            result2 = null;\n            pos = pos3;\n          }\n          if (result2 !== null) {\n            result2 = (function(offset, b) {return b;})(pos2, result2[1]);\n          }\n          if (result2 === null) {\n            pos = pos2;\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            pos2 = pos;\n            pos3 = pos;\n            if (input.charCodeAt(pos) === 44) {\n              result2 = \",\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\",\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result3 = parse_keyvalue();\n              if (result3 !== null) {\n                result2 = [result2, result3];\n              } else {\n                result2 = null;\n                pos = pos3;\n              }\n            } else {\n              result2 = null;\n              pos = pos3;\n            }\n            if (result2 !== null) {\n              result2 = (function(offset, b) {return b;})(pos2, result2[1]);\n            }\n            if (result2 === null) {\n              pos = pos2;\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, first, rest) {\r\n            if (first) { rest.unshift(first); } return rest;\r\n        })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_ref() {\n        var result0, result1;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.substr(pos, 2) === \"//\") {\n          result0 = \"//\";\n          pos += 2;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"//\\\"\");\n          }\n        }\n        if (result0 === null) {\n          if (input.charCodeAt(pos) === 47) {\n            result0 = \"/\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"/\\\"\");\n            }\n          }\n          if (result0 === null) {\n            if (input.charCodeAt(pos) === 36) {\n              result0 = \"$\";\n              pos++;\n            } else {\n              result0 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"$\\\"\");\n              }\n            }\n            if (result0 === null) {\n              if (input.substr(pos, 2) === \"**\") {\n                result0 = \"**\";\n                pos += 2;\n              } else {\n                result0 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"**\\\"\");\n                }\n              }\n              if (result0 === null) {\n                if (input.charCodeAt(pos) === 42) {\n                  result0 = \"*\";\n                  pos++;\n                } else {\n                  result0 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"*\\\"\");\n                  }\n                }\n                if (result0 === null) {\n                  if (input.substr(pos, 2) === \"..\") {\n                    result0 = \"..\";\n                    pos += 2;\n                  } else {\n                    result0 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\"..\\\"\");\n                    }\n                  }\n                  if (result0 === null) {\n                    if (input.charCodeAt(pos) === 46) {\n                      result0 = \".\";\n                      pos++;\n                    } else {\n                      result0 = null;\n                      if (reportFailures === 0) {\n                        matchFailed(\"\\\".\\\"\");\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_slashProperty();\n          result1 = result1 !== null ? result1 : \"\";\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) {\r\n                e = expr(a); if (b) { b.args.unshift(e); e = b; } return e;\r\n            })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          result0 = parse_id();\n          if (result0 !== null) {\n            result0 = (function(offset, a) { return expr(\"ref\", [a]); })(pos0, result0);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n        }\n        return result0;\n      }\n      \n      function parse_id() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (/^[a-z_]/.test(input.charAt(pos))) {\n          result1 = input.charAt(pos);\n          pos++;\n        } else {\n          result1 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"[a-z_]\");\n          }\n        }\n        if (result1 !== null) {\n          result0 = [];\n          while (result1 !== null) {\n            result0.push(result1);\n            if (/^[a-z_]/.test(input.charAt(pos))) {\n              result1 = input.charAt(pos);\n              pos++;\n            } else {\n              result1 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"[a-z_]\");\n              }\n            }\n          }\n        } else {\n          result0 = null;\n        }\n        if (result0 !== null) {\n          result1 = [];\n          if (/^[a-z_0-9]/.test(input.charAt(pos))) {\n            result2 = input.charAt(pos);\n            pos++;\n          } else {\n            result2 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"[a-z_0-9]\");\n            }\n          }\n          while (result2 !== null) {\n            result1.push(result2);\n            if (/^[a-z_0-9]/.test(input.charAt(pos))) {\n              result2 = input.charAt(pos);\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"[a-z_0-9]\");\n              }\n            }\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return a.join('') + b.join(''); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_property() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 47) {\n          result0 = \"/\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"/\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_slashProperty();\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a; })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          pos1 = pos;\n          if (input.charCodeAt(pos) === 123) {\n            result0 = \"{\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"{\\\"\");\n            }\n          }\n          if (result0 !== null) {\n            result1 = parse_conditional();\n            if (result1 !== null) {\n              if (input.charCodeAt(pos) === 125) {\n                result2 = \"}\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"}\\\"\");\n                }\n              }\n              if (result2 !== null) {\n                result0 = [result0, result1, result2];\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n          if (result0 !== null) {\n            result0 = (function(offset, a) { return expr(\"{}\", [a]); })(pos0, result0[1]);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n          if (result0 === null) {\n            pos0 = pos;\n            pos1 = pos;\n            if (input.charCodeAt(pos) === 91) {\n              result0 = \"[\";\n              pos++;\n            } else {\n              result0 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"[\\\"\");\n              }\n            }\n            if (result0 !== null) {\n              result1 = parse_conditional();\n              if (result1 !== null) {\n                if (input.charCodeAt(pos) === 93) {\n                  result2 = \"]\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\"]\\\"\");\n                  }\n                }\n                if (result2 !== null) {\n                  result0 = [result0, result1, result2];\n                } else {\n                  result0 = null;\n                  pos = pos1;\n                }\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n            if (result0 !== null) {\n              result0 = (function(offset, a) { return expr(\"[]\", [a]); })(pos0, result0[1]);\n            }\n            if (result0 === null) {\n              pos = pos0;\n            }\n          }\n        }\n        return result0;\n      }\n      \n      function parse_slashProperty() {\n        var result0;\n        var pos0;\n        \n        pos0 = pos;\n        result0 = parse_id();\n        if (result0 === null) {\n          result0 = parse_number();\n          if (result0 === null) {\n            result0 = parse_string();\n          }\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"/\", [a]); })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          if (input.substr(pos, 2) === \"..\") {\n            result0 = \"..\";\n            pos += 2;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"..\\\"\");\n            }\n          }\n          if (result0 === null) {\n            if (input.charCodeAt(pos) === 42) {\n              result0 = \"*\";\n              pos++;\n            } else {\n              result0 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"*\\\"\");\n              }\n            }\n          }\n          if (result0 !== null) {\n            result0 = (function(offset, a) { return expr(a, []); })(pos0, result0);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n        }\n        return result0;\n      }\n      \n      function parse_s() {\n        var result0, result1;\n        var pos0;\n        \n        reportFailures++;\n        pos0 = pos;\n        result0 = [];\n        if (/^[ ]/.test(input.charAt(pos))) {\n          result1 = input.charAt(pos);\n          pos++;\n        } else {\n          result1 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"[ ]\");\n          }\n        }\n        while (result1 !== null) {\n          result0.push(result1);\n          if (/^[ ]/.test(input.charAt(pos))) {\n            result1 = input.charAt(pos);\n            pos++;\n          } else {\n            result1 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"[ ]\");\n            }\n          }\n        }\n        if (result0 !== null) {\n          result0 = (function(offset) { return ''; })(pos0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        reportFailures--;\n        if (reportFailures === 0 && result0 === null) {\n          matchFailed(\"space\");\n        }\n        return result0;\n      }\n      \n      function parse_path() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_root();\n        if (result0 !== null) {\n          result1 = [];\n          result2 = parse_step();\n          while (result2 !== null) {\n            result1.push(result2);\n            result2 = parse_step();\n          }\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) {\r\n            while (b.length) {\r\n                a = joinPath(a, b.shift());\r\n            }\r\n            return a;\r\n        })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        return result0;\n      }\n      \n      function parse_root() {\n        var result0, result1;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        result0 = parse_implicitDotRoot();\n        if (result0 !== null) {\n          result1 = parse_dotStep();\n          result1 = result1 !== null ? result1 : \"\";\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a, b) { return joinPath(a,b); })(pos0, result0[0], result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          result0 = parse_explicitDotRoot();\n        }\n        return result0;\n      }\n      \n      function parse_step() {\n        var result0, result1;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 46) {\n          result0 = \".\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\".\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_dotStep();\n          if (result1 !== null) {\n            result0 = [result0, result1];\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return a; })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          result0 = parse_noDotStep();\n        }\n        return result0;\n      }\n      \n      function parse_implicitDotRoot() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        if (input.charCodeAt(pos) === 47) {\n          result0 = \"/\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"/\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result0 = (function(offset) { return expr(\"root\"); })(pos0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          if (input.charCodeAt(pos) === 64) {\n            result0 = \"@\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"@\\\"\");\n            }\n          }\n          if (result0 !== null) {\n            result0 = (function(offset) { return expr(\"this\"); })(pos0);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n          if (result0 === null) {\n            pos0 = pos;\n            pos1 = pos;\n            if (input.charCodeAt(pos) === 46) {\n              result0 = \".\";\n              pos++;\n            } else {\n              result0 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\".\\\"\");\n              }\n            }\n            if (result0 !== null) {\n              if (input.charCodeAt(pos) === 46) {\n                result2 = \".\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\".\\\"\");\n                }\n              }\n              if (result2 !== null) {\n                result1 = [];\n                while (result2 !== null) {\n                  result1.push(result2);\n                  if (input.charCodeAt(pos) === 46) {\n                    result2 = \".\";\n                    pos++;\n                  } else {\n                    result2 = null;\n                    if (reportFailures === 0) {\n                      matchFailed(\"\\\".\\\"\");\n                    }\n                  }\n                }\n              } else {\n                result1 = null;\n              }\n              if (result1 !== null) {\n                result0 = [result0, result1];\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n            if (result0 !== null) {\n              result0 = (function(offset, a) { return expr(\"ancestor\", [a.length]); })(pos0, result0[1]);\n            }\n            if (result0 === null) {\n              pos = pos0;\n            }\n          }\n        }\n        return result0;\n      }\n      \n      function parse_explicitDotRoot() {\n        var result0;\n        var pos0;\n        \n        pos0 = pos;\n        result0 = parse_id();\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"ref\", [a]); })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          if (input.charCodeAt(pos) === 42) {\n            result0 = \"*\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"*\\\"\");\n            }\n          }\n          if (result0 !== null) {\n            result0 = (function(offset) { return expr(\"values\", []); })(pos0);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n        }\n        return result0;\n      }\n      \n      function parse_dotStep() {\n        var result0;\n        var pos0;\n        \n        pos0 = pos;\n        result0 = parse_id();\n        if (result0 === null) {\n          result0 = parse_string();\n          if (result0 === null) {\n            result0 = parse_number();\n          }\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"get\", [a]); })(pos0, result0);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          if (input.charCodeAt(pos) === 42) {\n            result0 = \"*\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"*\\\"\");\n            }\n          }\n          if (result0 !== null) {\n            result0 = (function(offset) { return expr(\"values\", []); })(pos0);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n        }\n        return result0;\n      }\n      \n      function parse_noDotStep() {\n        var result0, result1, result2;\n        var pos0, pos1;\n        \n        pos0 = pos;\n        pos1 = pos;\n        if (input.charCodeAt(pos) === 123) {\n          result0 = \"{\";\n          pos++;\n        } else {\n          result0 = null;\n          if (reportFailures === 0) {\n            matchFailed(\"\\\"{\\\"\");\n          }\n        }\n        if (result0 !== null) {\n          result1 = parse_conditional();\n          if (result1 !== null) {\n            if (input.charCodeAt(pos) === 125) {\n              result2 = \"}\";\n              pos++;\n            } else {\n              result2 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"}\\\"\");\n              }\n            }\n            if (result2 !== null) {\n              result0 = [result0, result1, result2];\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n        } else {\n          result0 = null;\n          pos = pos1;\n        }\n        if (result0 !== null) {\n          result0 = (function(offset, a) { return expr(\"eval\", [a]); })(pos0, result0[1]);\n        }\n        if (result0 === null) {\n          pos = pos0;\n        }\n        if (result0 === null) {\n          pos0 = pos;\n          pos1 = pos;\n          if (input.charCodeAt(pos) === 91) {\n            result0 = \"[\";\n            pos++;\n          } else {\n            result0 = null;\n            if (reportFailures === 0) {\n              matchFailed(\"\\\"[\\\"\");\n            }\n          }\n          if (result0 !== null) {\n            result1 = parse_conditional();\n            if (result1 !== null) {\n              if (input.charCodeAt(pos) === 93) {\n                result2 = \"]\";\n                pos++;\n              } else {\n                result2 = null;\n                if (reportFailures === 0) {\n                  matchFailed(\"\\\"]\\\"\");\n                }\n              }\n              if (result2 !== null) {\n                result0 = [result0, result1, result2];\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n          } else {\n            result0 = null;\n            pos = pos1;\n          }\n          if (result0 !== null) {\n            result0 = (function(offset, a) { return expr(\"pred\", [a]); })(pos0, result0[1]);\n          }\n          if (result0 === null) {\n            pos = pos0;\n          }\n          if (result0 === null) {\n            pos0 = pos;\n            pos1 = pos;\n            if (input.charCodeAt(pos) === 40) {\n              result0 = \"(\";\n              pos++;\n            } else {\n              result0 = null;\n              if (reportFailures === 0) {\n                matchFailed(\"\\\"(\\\"\");\n              }\n            }\n            if (result0 !== null) {\n              result1 = parse_values();\n              if (result1 !== null) {\n                if (input.charCodeAt(pos) === 41) {\n                  result2 = \")\";\n                  pos++;\n                } else {\n                  result2 = null;\n                  if (reportFailures === 0) {\n                    matchFailed(\"\\\")\\\"\");\n                  }\n                }\n                if (result2 !== null) {\n                  result0 = [result0, result1, result2];\n                } else {\n                  result0 = null;\n                  pos = pos1;\n                }\n              } else {\n                result0 = null;\n                pos = pos1;\n              }\n            } else {\n              result0 = null;\n              pos = pos1;\n            }\n            if (result0 !== null) {\n              result0 = (function(offset, a) { return expr(\"call\", [a]); })(pos0, result0[1]);\n            }\n            if (result0 === null) {\n              pos = pos0;\n            }\n          }\n        }\n        return result0;\n      }\n      \n      \n      function cleanupExpected(expected) {\n        expected.sort();\n        \n        var lastExpected = null;\n        var cleanExpected = [];\n        for (var i = 0; i < expected.length; i++) {\n          if (expected[i] !== lastExpected) {\n            cleanExpected.push(expected[i]);\n            lastExpected = expected[i];\n          }\n        }\n        return cleanExpected;\n      }\n      \n      function computeErrorPosition() {\n        /*\n         * The first idea was to use |String.split| to break the input up to the\n         * error position along newlines and derive the line and column from\n         * there. However IE's |split| implementation is so broken that it was\n         * enough to prevent it.\n         */\n        \n        var line = 1;\n        var column = 1;\n        var seenCR = false;\n        \n        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {\n          var ch = input.charAt(i);\n          if (ch === \"\\n\") {\n            if (!seenCR) { line++; }\n            column = 1;\n            seenCR = false;\n          } else if (ch === \"\\r\" || ch === \"\\u2028\" || ch === \"\\u2029\") {\n            line++;\n            column = 1;\n            seenCR = true;\n          } else {\n            column++;\n            seenCR = false;\n          }\n        }\n        \n        return { line: line, column: column };\n      }\n      \n      \r\n          //  shorthand to create a new expression\r\n          function expr(op, args) {\r\n              return new glass.Expression(op, args);\r\n          }\r\n          //  left associates operations\r\n          function joinLeft(e, arrayOfOps) {\r\n              while (arrayOfOps.length > 0) {\r\n                  array = arrayOfOps.shift();\r\n                  e = expr(array[0], [e,array[1]]);\r\n              }\r\n              return e;\r\n          }\r\n          function unaryRight(ops, e) {\r\n              while (ops.length > 0) {\r\n                  e = expr(ops.pop(), [e]);\r\n              }\r\n              return e;\r\n          }\r\n          function toString(array) {\r\n              if (Array.isArray(array)) {\r\n                  for (var i = 0; i < array.length; i++)\r\n                      array[i] = toString(array[i]);\r\n                  return array.join('');\r\n              }\r\n              return array;\r\n          }\r\n          function joinPath(left, right) {\r\n              if (right) {\r\n                  right.args.unshift(left);\r\n                  left = right;\r\n              }\r\n              return left;\r\n          }\r\n      \n      \n      var result = parseFunctions[startRule]();\n      \n      /*\n       * The parser is now in one of the following three states:\n       *\n       * 1. The parser successfully parsed the whole input.\n       *\n       *    - |result !== null|\n       *    - |pos === input.length|\n       *    - |rightmostFailuresExpected| may or may not contain something\n       *\n       * 2. The parser successfully parsed only a part of the input.\n       *\n       *    - |result !== null|\n       *    - |pos < input.length|\n       *    - |rightmostFailuresExpected| may or may not contain something\n       *\n       * 3. The parser did not successfully parse any part of the input.\n       *\n       *   - |result === null|\n       *   - |pos === 0|\n       *   - |rightmostFailuresExpected| contains at least one failure\n       *\n       * All code following this comment (including called functions) must\n       * handle these states.\n       */\n      if (result === null || pos !== input.length) {\n        var offset = Math.max(pos, rightmostFailuresPos);\n        var found = offset < input.length ? input.charAt(offset) : null;\n        var errorPosition = computeErrorPosition();\n        \n        throw new this.SyntaxError(\n          cleanupExpected(rightmostFailuresExpected),\n          found,\n          offset,\n          errorPosition.line,\n          errorPosition.column\n        );\n      }\n      \n      return result;\n    },\n    \n    /* Returns the parser source code. */\n    toSource: function() { return this._source; }\n  };\n  \n  /* Thrown when a parser encounters a syntax error. */\n  \n  result.SyntaxError = function(expected, found, offset, line, column) {\n    function buildMessage(expected, found) {\n      var expectedHumanized, foundHumanized;\n      \n      switch (expected.length) {\n        case 0:\n          expectedHumanized = \"end of input\";\n          break;\n        case 1:\n          expectedHumanized = expected[0];\n          break;\n        default:\n          expectedHumanized = expected.slice(0, expected.length - 1).join(\", \")\n            + \" or \"\n            + expected[expected.length - 1];\n      }\n      \n      foundHumanized = found ? quote(found) : \"end of input\";\n      \n      return \"Expected \" + expectedHumanized + \" but \" + foundHumanized + \" found.\";\n    }\n    \n    this.name = \"SyntaxError\";\n    this.expected = expected;\n    this.found = found;\n    this.message = buildMessage(expected, found);\n    this.offset = offset;\n    this.line = line;\n    this.column = column;\n  };\n  \n  result.SyntaxError.prototype = Error.prototype;\n  \n  return result;\n})()",
        path: "glass.Expression._parse",
        uri: "global:/glass/Expression/_parse"
    };
    _parse._init_ = function() {
        parse = global.glass.Expression._parse.parse;
        SyntaxError = global.glass.Expression._parse.SyntaxError;
        values = global.glass.values;
        delete _parse._init_;
    }
}).call(glass.Expression)