/**
 * Created by Cooper on 2019/09/18.
 */

export function build(scheme: any) {
  function connect(scheme: any, preKey = ''): string {
    if (Array.isArray(scheme) && scheme.length === 1) {
      const inner =
        typeof scheme[0] === 'object'
          ? '${obj'+preKey+'.reduce((s,obj)=>s+' + connect(scheme[0]) + '+",","").slice(0, -1)}' // prettier-ignore
          : '${join(obj' + preKey + ',"' + scheme[0] + '")}';
      if (preKey === '') {
        return '`[' + inner + ']`';
      }
      return '[' + inner + ']';
    }

    if (Array.isArray(scheme) && scheme.length > 1) {
      const inner = scheme.reduce((s, k, i) => {
        if (k === 'string') {
          return s + '"' + '${obj' + preKey + '[' + i + ']}' + '"' + // prettier-ignore
                        (i === scheme.length - 1 ? '' : ',') // prettier-ignore
        }

        if (k === 'object') {
          return s + '${JSON.stringify(obj'+ preKey+ '[' + i + ']' +')}' + // prettier-ignore
                        (i === scheme.length - 1 ? '' : ',') // prettier-ignore
        }

        if (k === 'number' || k === 'boolean') {
          return s + '${obj' + preKey + '[' + i + ']}' + // prettier-ignore
                        (i === scheme.length - 1 ? '' : ',') // prettier-ignore
        }

        if (typeof k === 'object' && !Array.isArray(k)) {
          return s + connect(k, preKey + '[' + i + ']') + // prettier-ignore
                        (i === scheme.length - 1 ? '' : ',') // prettier-ignore
        }

        if (typeof k === 'object' && Array.isArray(k)) {
          return s + connect(k, preKey + '[' + i + ']') + // prettier-ignore
                        (i === scheme.length - 1 ? '' : ',') // prettier-ignore
        }

        return s + '"' + '${obj' + preKey + '[' + i + ']}' + '"' + // prettier-ignore
                    (i === scheme.length - 1 ? '' : ',') // prettier-ignore
      }, '');

      return preKey === '' ? '`[' + inner + ']`' : '[' + inner + ']';
    }

    const keys = Object.keys(scheme);

    const inner = keys.reduce((s, k, i) => {
      if (scheme[k] === 'string') {
        return (
          s + '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"' + // prettier-ignore
                    (i === keys.length - 1 ? '' : ',') // prettier-ignore
        );
      }
      if (scheme[k] === 'number' || scheme[k] === 'boolean') {
        return (
          s + '"' + k + '":' + '${obj' + preKey + '.' + k + '}' + // prettier-ignore
                    (i === keys.length - 1 ? '' : ',') // prettier-ignore
        );
      }

      if (scheme[k] === 'object') {
        return (
          s + '"' + k + '":' + '${JSON.stringify(obj' + preKey + '.' + k + ')}' + // prettier-ignore
                    (i === keys.length - 1 ? '' : ',') // prettier-ignore
        );
      }

      if (typeof scheme[k] === 'object') {
        return s + '"' + k + '":' +  connect(scheme[k],preKey+ '.' + k) +  // prettier-ignore
                    (i === keys.length - 1 ? '' : ',') // prettier-ignore
      }

      return (
        s + '"' + k + '":' + '"${obj' + preKey + '.' + k + '}"' + // prettier-ignore
                (i === keys.length - 1 ? '' : ',') // prettier-ignore
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
    '((obj) => {' + join.toString() + ';return' + connect(scheme) + '})'
  );

  return function(obj: any) {
    return exec(obj);
  };
}

export function parse(jsonStr: string) {
  return eval('(' + jsonStr + ')');
}
