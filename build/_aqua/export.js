"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNeighborhood = void 0;
const v3_1 = require("@fluencelabs/fluence/dist/internal/compilerSupport/v3");
function getNeighborhood(...args) {
    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                        (call %init_peer_id% ("getDataSrv" "relay") [] relay)
                       )
                       (new $already_hashed
                        (new $status
                         (new $peerStream
                          (seq
                           (new $count
                            (seq
                             (call -relay- ("op" "noop") [])
                             (xor
                              (seq
                               (seq
                                (seq
                                 (call relay ("kad" "neighborhood") [relay $already_hashed $count] peers)
                                 (par
                                  (fold peers peer-0
                                   (par
                                    (seq
                                     (xor
                                      (seq
                                       (call peer-0 ("op" "noop") [])
                                       (ap peer-0 $peerStream)
                                      )
                                      (seq
                                       (call -relay- ("op" "noop") [])
                                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                      )
                                     )
                                     (call relay ("op" "noop") [])
                                    )
                                    (next peer-0)
                                   )
                                  )
                                  (null)
                                 )
                                )
                                (par
                                 (call relay ("op" "noop") [$peerStream.$.[10]!])
                                 (call relay ("peer" "timeout") [2500 "timeout"])
                                )
                               )
                               (call -relay- ("op" "noop") [])
                              )
                              (seq
                               (call -relay- ("op" "noop") [])
                               (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                              )
                             )
                            )
                           )
                           (call %init_peer_id% ("op" "identity") [$peerStream] peerStream-fix)
                          )
                         )
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [peerStream-fix])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `;
    return (0, v3_1.callFunction)(args, {
        "functionName": "getNeighborhood",
        "arrow": {
            "tag": "arrow",
            "domain": {
                "tag": "labeledProduct",
                "fields": {
                    "relay": {
                        "tag": "scalar",
                        "name": "string"
                    }
                }
            },
            "codomain": {
                "tag": "unlabeledProduct",
                "items": [
                    {
                        "tag": "array",
                        "type": {
                            "tag": "scalar",
                            "name": "string"
                        }
                    }
                ]
            }
        },
        "names": {
            "relay": "-relay-",
            "getDataSrv": "getDataSrv",
            "callbackSrv": "callbackSrv",
            "responseSrv": "callbackSrv",
            "responseFnName": "response",
            "errorHandlingSrv": "errorHandlingSrv",
            "errorFnName": "error"
        }
    }, script);
}
exports.getNeighborhood = getNeighborhood;
//# sourceMappingURL=export.js.map