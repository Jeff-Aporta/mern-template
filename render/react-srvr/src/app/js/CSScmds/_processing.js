import CSScmds from "./CSScmds";

function forcePx(s) {
  return s.toString().endsWith("px") ? s : s + "px";
}

function camelToKebab(string) {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export default class {
  #_value = [];

  #compare(head, body, rule) {
    if (Array.isArray(head)) {
      if (head.length == 1) {
        head = ["x", ...head];
      }
    } else {
      return this.#compare([head], body);
    }
    const [v, sz] = head;
    return this.if(`${v}${rule}${sz}`, body);
  }
  /*
    LESS THAN:
    --------------------
   
    .gt(LIMIT,{
        PROPERTY_CSS: [BELOW, ABOVE]
    })

    */
  lt(head, body) {
    return this.#compare(head, body, "<");
  }
  ltX(head, body) {
    return this.lt(["x", head], body);
  }
  ltY(head, body) {
    return this.lt(["y", head], body);
  }
  /*
   GREATER THAN:
   --------------------
   
   .gt(LIMIT,{
      PROPERTY_CSS: [ABOVE ,BELOW]
   })

   */
  gt(head, body) {
    return this.#compare(head, body, ">");
  }
  gtX(head, body) {
    return this.gt(["x", head], body);
  }
  gtY(head, body) {
    return this.gt(["y", head], body);
  }
  /*
   BETWEEN:
   --------------------

   .btw([LOWER_LIMIT,AXIS,UPPER_LIMIT],{
      PROPERTY_CSS: [BELOW, INSIDE ,ABOVE]
   })

   # Para "x": (default)

   .btw([LOWER_LIMIT,UPPER_LIMIT],{
      PROPERTY_CSS: [BELOW, INSIDE ,ABOVE]
   })

   */
  btw(head, body) {
    if (Array.isArray(head)) {
      if (head.length == 2) {
        head = [head[0], "x", head[1]];
      }
    } else {
      console.log("CSScmds.btw: Invalid head in btw", head);
      return this;
    }
    const [strt, v, end] = head;
    if (!strt || !v || !end) {
      console.log("CSScmds.btw: Error en el head", { strt, v, end });
      return this;
    }
    return this.if(`${strt}<${v}<${end}`, body);
  }
  btwX(head, body) {
    return this.btw([head[0], "x", head[1]], body);
  }
  btwY(head, body) {
    return this.btw([head[0], "y", head[1]], body);
  }
  /*
   IF:
   STRING_COND (EXAMPLES): 
      LT:   "x<500px", "y<500px"
      GT:   "x>500px", "y<500px"
      BTW:  "500px<x<1000px", "500px<y<1000px"
   --------------------

   .if(STRING_COND,{
      PROPERTY_CSS: [BELOW, INSIDE ,ABOVE]
   })

   */
  if(cond, body) {
    this.#_value.push(
      `${cond}?{${Object.entries(body)
        .map(
          ([k, v]) =>
            `${camelToKebab(k)}:(${v.map((_v) => _v || "").join(",")})`
        )
        .join(";")}}`
    );
    return this;
  }
  /*
    LERP:
    FLAGS: "e" to ends un start projection, "p" to open projection
    --------------------
    
    .lerp([START_PROJECT, AXIS, END_PROJECT],{
        PROPERTY_CSS: [FLAG_PROJ_START, START_VAL, END_VAL, FLAG_PROJ_END]
    })

  */
  lerp(head, body) {
    if(!Array.isArray(head)){
      head = [head]
    }
    const ks = {
      S: {
        e: "[",
        o: "(",
      },
      E: {
        e: "]",
        o: ")",
      },
    };
    const [start, v, end] = head;
    if (!start || !v || !end) {
      console.log("CSScmds.lerphw: Error en el head", { start, v, end });
      return this;
    }
    this.#_value.push(
      `${forcePx(start)}<-${v}->${forcePx(end)}?{${Object.entries(body)
        .map(([k, v]) => {
          let [fs = "e", s, e, fe = "e"] = v.length == 2 ? ["e", ...v] : v;
          fs = ks.S[fs];
          fe = ks.E[fe];
          if (!fs || !s || !e || !fe) {
            console.log("CSScmds.lerphw: Error en el body", { fs, s, e, fe });
            return "";
          }
          return `${camelToKebab(k)}:${fs}${[s, e]
            .map((st) => forcePx(st))
            .join(",")}${fe}`;
        })
        .filter(Boolean)
        .join(";")}}`
    );
    return this;
  }
  lerpX(head, body) {
    return this.lerp([head[0], "x", head[1]], body);
  }
  lerpY(head, body) {
    return this.lerp([head[0], "y", head[1]], body);
  }
  end(clss = "") {
    const code = this.toString();
    this.#_value = [];
    const ex = CSScmds({ code, clss });
    return ex;
  }
  toString() {
    return this.#_value.join("\n");
  }
}
