export default function (e, n, t) {
    if(ga!=undefined) {
        ga("send", {
            hitType: "event",
            eventCategory: e,
            eventAction: n,
            eventLabel: t,
            eventValue: 1
        })
    }
}