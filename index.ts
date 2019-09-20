/**
 * Created by Cooper on 2019/09/18.
 */

export function build(schema: any, strict = true): (obj: any) => string {
  function connect(schema: any, preKey = ''): string {
    if (Array.isArray(schema) && schema.length === 1) {
      const inner =
        typeof schema[0] === 'object'
          ? '${obj'+preKey+'.reduce((s,obj)=>s+' + connect(schema[0]) + '+",","").slice(0, -1)}' // prettier-ignore
          : '${join(obj' + preKey + ',"' + schema[0] + '")}';
      if (preKey === '') {
        return '`[' + inner + ']`';
      }
      return '[' + inner + ']';
    }

    if (Array.isArray(schema) && schema.length > 1) {
      const inner = schema.reduce((s, k, i) => {
        if (k === 'string') {
          return s + '"' + '${obj' + preKey + '[' + i + ']}' + '"' + // prettier-ignore
                        (i === schema.length - 1 ? '' : ',') // prettier-ignore
        }

        if (k === 'object') {
          return s + '${JSON.stringify(obj'+ preKey+ '[' + i + ']' +')}' + // prettier-ignore
                        (i === schema.length - 1 ? '' : ',') // prettier-ignore
        }

        if (k === 'number' || k === 'boolean') {
          return s + '${obj' + preKey + '[' + i + ']}' + // prettier-ignore
                        (i === schema.length - 1 ? '' : ',') // prettier-ignore
        }

        if (typeof k === 'object' && !Array.isArray(k)) {
          return s + connect(k, preKey + '[' + i + ']') + // prettier-ignore
                        (i === schema.length - 1 ? '' : ',') // prettier-ignore
        }

        if (typeof k === 'object' && Array.isArray(k)) {
          return s + connect(k, preKey + '[' + i + ']') + // prettier-ignore
                        (i === schema.length - 1 ? '' : ',') // prettier-ignore
        }

        return s + '"' + '${obj' + preKey + '[' + i + ']}' + '"' + // prettier-ignore
                    (i === schema.length - 1 ? '' : ',') // prettier-ignore
      }, '');

      return preKey === '' ? '`[' + inner + ']`' : '[' + inner + ']';
    }

    const keys = Object.keys(schema);

    const inner = keys.reduce((s, k, i) => {
      if (schema[k] === 'string') {
        if (!strict) {
          return (
            s + (i === 0 ? '' : ',')+ '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"' // prettier-ignore
          );
        }

        return (
          s + '${obj' + preKey + '.' + k + '===undefined?"":`' + (i === 0 ? '' : ',') +
          '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"`}' // prettier-ignore
        );
      }

      if (schema[k] === 'number' || schema[k] === 'boolean') {
        if (!strict) {
          return (
            s +(i === 0 ? '' : ',')+ '"' + k + '":' + '${obj' + preKey + '.' + k + '}' // prettier-ignore
          );
        }

        return (
          s + '${obj' + preKey + '.' + k + '===undefined?"":`' + (i === 0 ? '' : ',') +
          '"' + k + '":' + '${obj' + preKey + '.' + k + '}`}' // prettier-ignore
        );
      }

      if (schema[k] === 'object') {
        if (!strict) {
          return (
            s + (i === 0 ? '' : ',')+'"' + k + '":' + '${JSON.stringify(obj' + preKey + '.' + k + ')}' // prettier-ignore
          );
        }

        return (
          s + '${obj' + preKey + '.' + k + '===undefined?"":`' + (i === 0 ? '' : ',') +
          '"' + k + '":' + '${JSON.stringify(obj' + preKey + '.' + k + ')}`}' // prettier-ignore
        );
      }

      if (typeof schema[k] === 'object') {
        if (!strict) {
          return s +(i === 0 ? '' : ',')+ '"' + k + '":' +  connect(schema[k],preKey+ '.' + k) // prettier-ignore
        }

        return (
          s + '${obj' + preKey + '.' + k + '===undefined?"":`' + (i === 0 ? '' : ',') +
          '"' + k + '":' + connect(schema[k], preKey + '.' + k) + '`}' // prettier-ignore
        );
      }

      if (!strict) {
        return (
          s + (i === 0 ? '' : ',')+ '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"' // prettier-ignore
        );
      }

      return (
        s + '${obj' + preKey + '.' + k + '===undefined?"":`' + (i === 0 ? '' : ',') +
        '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"`}' // prettier-ignore
      );
    }, '');

    return preKey === '' ? '`{' + inner + '}`' : '{' + inner + '}';
  }

  function join(obj: any, type: string) {
    let str = '';
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      if (i === len - 1) {
        if (type === 'string') {
          str += '"' + obj[i] + '"';
        } else if (type === 'number' || type === 'boolean') {
          str += obj[i];
        } else if (type === 'object') {
          str += JSON.stringify(obj[i]);
        }
      } else {
        if (type === 'string') {
          str += '"' + obj[i] + '"' + ',';
        } else if (type === 'number' || type === 'boolean') {
          str += obj[i] + ',';
        } else if (type === 'object') {
          str += JSON.stringify(obj[i]) + ',';
        }
      }
    }
    return str;
  }

  const exec = eval(
    '((obj) => {' + join.toString() + ';return' + connect(schema) + '})'
  );

  return function(obj: any): string {
    return exec(obj);
  };
}

export function parse(jsonStr: string) {
  return eval('(' + jsonStr + ')');
}
