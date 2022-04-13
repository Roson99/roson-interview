/*
 * @Description  : index.js
 * @Author       : Roson
 * @Date         : 2022-03-30 12:05:19
 * @LastEditors  : Roson
 * @LastEditTime : 2022-04-12 23:03:34
 */
import {
  request,
  add,
  debounce,
  MyPromise,
  Commitment,
  deepClone,
  throttle,
} from "roson-fp";
import axios from "axios";
// const axios = require('axios')

const root = document.getElementById("app");
const btns = Array(20)
  .join(",")
  .split(",")
  .map((i) => document.createElement("button"));

btns?.forEach((btn, index) => {
  btn.innerText = "测试" + index;
  root.appendChild(btn);
});
const obj = {
  a: { a1: { a11: "011", a12: "012" } },
  c: () => {},
  d: { d1: ["1", "2"], d2: {} },
  e: "eeee",
};
const thenable = [
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  },
];
const getMyPromiseObj = () => {
  let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok1");
    }, 1000);
  });

  let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok2");
    }, 800);
  });

  let p3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok3");
    }, 600);
  });

  let xp1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject("err1");
    }, 900);
  });

  let xp2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject("err2");
    }, 700);
  });

  let xp3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject("err3");
    }, 500);
  });
  return { p1, p2, p3, xp1, xp2, xp3 };
};
const getPromiseObj = () => {
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok1");
    }, 1000);
  });

  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok2");
    }, 800);
  });

  let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok3");
    }, 600);
  });

  let xp1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("err1");
    }, 900);
  });

  let xp2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("err2");
    }, 700);
  });

  let xp3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("err3");
    }, 500);
  });
  return { p1, p2, p3, xp1, xp2, xp3 };
};
// const obj = [1, 2, 3];
[
  // [0]标准Promise
  () => {
    const { p1, p2, p3, xp1, xp2, xp3 } = getPromiseObj();
    // const p = new Promise((resolve, reject) => {
    //   console.log("0-0");
    //   setTimeout(() => {
    //     console.log("0-1");
    //     // resolve(new Promise((re) => setTimeout(() => re("!"))));
    //     resolve(
    //       new Promise((r1) => {
    //         setTimeout(() => r1("!!!"));
    //       })
    //     );
    //   }, 1000);
    // });
    Promise.any([xp1, xp2, xp3]).then(
      (res) => console.log("pass", res),
      (err) => console.log("err", err)
    );
  },
  // [1]MyPromise
  () => {
    const myP = new MyPromise((resolve) => {
      console.log("mm 0-0");
      setTimeout(() => {
        console.log("0-1");
        resolve(new Promise((re) => setTimeout(() => re("!"))));
        // resolve("!!!");
      }, 1000);
    });
    myP
      .then((res) => {
        console.log("mm Step1", res);
        return new MyPromise((r, x) => {
          setTimeout(() => r("????"), 0);
        });
      })
      .then(undefined, (res) => {
        console.log("Step2", res);
        return new Error("then2 //////");
      })
      .then((res) => {
        console.log("mm Step3", res);
        return "then3 ///////";
      })
      .then((res) => {
        console.log("mm Step4", res);
        return "then4 ///////";
      });
  },
  // [2]MyPromise api resolve reject then finally catch
  () => {
    MyPromise.reject(456)
      .finally(() => {
        return new MyPromise((resolve, reject) => {
          setTimeout(() => {
            resolve(123);
          }, 3000);
        });
      })
      .then((data) => {
        console.log(data, "success");
      })
      .catch((err) => {
        console.log(err, "error");
      });
  },
  // [3]Promise / My all: Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，并且只返回一个Promise实例， 那个输入的所有promise的resolve回调的结果是一个数组。这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。
  () => {
    const all = (list) => {
      const resList = [];
      let count = 0;
      return new Promise((resolve, reject) => {
        list.forEach((item, index) => {
          Promise.resolve(item)
            .then((res) => {
              resList[index] = res;
              if (++count === list.length) {
                resolve(resList);
              }
            })
            .catch((e) => reject(e));
        });
      });
    };

    all([1, 2, 3, p1, p2]).then(
      (data) => {
        console.log("resolve", data);
      },
      (err) => {
        console.log("reject", err);
      }
    );
  },
  // [4]Promise any:  若有一个成功就resolve 都失败则返回`失败的 promise 和AggregateError类型`的实例
  () => {
    const { p1, p2, p3, xp1, xp2, xp3 } = getMyPromiseObj();
    const any = (list) => {
      return new Promise((resolve, reject) => {
        const rejectedArray = [];
        list.forEach((item) => {
          Promise.resolve(item).then(
            (res) => resolve(res),
            (reason) => {
              rejectedArray.push(reason);
              if (rejectedArray.length === list.length) {
                reject(new AggregateError(rejectedArray));
              }
            }
          );
        });
      });
    };
    any([p1, p2, p3]).then((res) => console.log(res));
  },
  // [5]Promise race:  Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
  () => {
    const { p1, p2, p3, xp1, xp2, xp3 } = getMyPromiseObj();
    const race = (list) => {
      return new Promise((resolve, reject) => {
        list.forEach((item) => {
          Promise.resolve(item)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        });
      });
    };
    // Promise.race([p1, p2, xp3]).then(
    //   (res) => console.log("race", res),
    //   (err) => console.log("race err", err)
    // );
    race([p1, p2, xp3]).then(
      (res) => console.log(res),
      (err) => console.log("race err", err)
    );
  },
  // [6]面向对象 es5 es6 构造函数
  () => {
    // es5
    const food = {
      name: "name",
      setName: function (n) {
        this.name = n;
        return this;
      },
      getName: function () {
        console.log(this.name);
        return this;
      },
    };
    // es6 class 面向对象
    class Food {
      name = "";
      age = "";
      constructor(n = "未知") {
        this.name = n;
        this.print = this.print.bind(this);
      }
      setName(n) {
        this.name = n;
        return this;
      }
      getName() {
        console.log(this.name);
        return this;
      }
      print(name) {
        console.log("??", this);
        this.say(name);
      }
      say(name) {
        // console.log(name);
      }
    }
    const f = new Food();
    const { print } = f;
    // f.getName()
    //   .setName("apple")
    //   .getName()
    //   .setName("banana")
    //   .getName()
    //   .setName("orange")
    //   .getName()
    //   .getName();
    // Object.defineProperty(f, "d", { value: "ddd", enumerable: false });
    console.log(f, print);
  },
  // [7]面试题 链式调用
  () => {
    const data = [
      { userId: 8, title: "title1" },
      { userId: 11, title: "other" },
      { userId: 15, title: null },
      { userId: 19, title: "title2" },
    ];
    class Find {
      constructor(v) {
        this.setValue(v);
      }
      setValue(v) {
        this.value = v;
      }
      where(obj) {
        const rules = Object.entries(obj); //[['title', /\d$/]]
        const result = this.value.filter((item) => {
          return rules.find(([key, reg]) => {
            return reg.test(item[key]);
          });
        });
        this.setValue(result);
        return this;
      }
      orderBy(key, sortType = "desc") {
        const res = this.value.sort((a, b) => {
          return sortType === "desc" ? b[key] - a[key] : a[key] - b[key];
        });
        this.setValue(res);
        return this.value;
      }
    }
    const find = (v) => Reflect.construct(Find, [v]);
    const result = find(data).where({ title: /\d$/ }).orderBy("userId", "desc");
    console.log(result);
  },
  // [8]面试题 深度比较
  () => {
    const obj1 = {
      a: 1,
      c: 3,
      b: {
        c: [1, 3],
      },
    };
    const obj2 = {
      c: 3,
      b: {
        c: [1, 3],
      },
      a: 1,
    };
    const obj3 = {
      a: 1,
      c: 3,
      b: {
        c: [3, 3],
      },
    };

    const isEqual = (a, b) => {
      const kA = Object.keys(a);
      const kB = Object.keys(b);
      if (kA.length !== kB.length) return false;
      for (let k in a) {
        console.log(a[k], b[k]);
        if (typeof a[k] !== typeof b[k]) return false;
        if (
          typeof a[k] !== "object" &&
          typeof b[k] !== "object" &&
          a[k] !== b[k]
        )
          return false;
        if (Array.isArray(a[k]) && Array.isArray(b[k]))
          return arrayEqual(a[k], b[k]);
        if (
          typeof a[k] === "object" &&
          typeof b[k] === "object" &&
          a[k] !== null &&
          b[k] !== null
        )
          return isEqual(a[k], b[k]);
      }
      return true;
    };

    const arrayEqual = (la, lb) => {
      if (la.length !== lb.length) return false;
      if (la.find((a, index) => a !== lb[index])) return false;
      return true;
    };

    console.log(isEqual(obj3, obj3));
  },
  // [9]面试题 判断loop
  () => {
    const a = {};
    // const b = {};
    a.b = a;
    const hasLoop = (target, src = []) => {
      if (typeof target !== "object") return false;
      const source = src.concat(target);
      for (let k in target) {
        if (source.find((i) => i === target[k]) || hasLoop(target[k], source))
          return true;
      }
      return false;
    };
    console.log(hasLoop(a));
  },
  // [10] 防抖节流 + axios
  () => {
    throttleFn("@@ gogogog", Date.now());
  },
].forEach((fn, index) => (btns[index].onclick = fn));

const api = (params) =>
  request("/api/callback", {
    method: "get",
    data: params,
  });

const fn = async (...payload) => {
  count++;
  console.log(count);
  const params = {
    cmd: 1059,
    callback: "phone",
    phone: 18782019393,
  };
  // const res = await axios({
  //   method: "get",
  //   url: "https://www.baifubao.com/callback",
  //   params,
  // });
  // api(params);
};
let count = 0;
const debounceFn = debounce(fn, 1000);
const throttleFn = throttle(fn, 5000);