import { mountText } from "../directives/text.js"
import { mountOn } from "../directives/on.js"
import { mountIf } from "../directives/if.js"
import { mountFor } from "../directives/for.js"
import { mountModel } from "../directives/model.js"
import { mountInit } from "../directives/init.js"
import { mountBind } from "../directives/bind.js"
import { mountShow } from "../directives/show.js"
import { mountClass } from "../directives/class.js"

export const handlers = [
  mountText,
  mountOn,
  mountIf,
  mountFor,
  mountModel,
  mountInit,
  mountBind,
  mountShow,
  mountClass
]