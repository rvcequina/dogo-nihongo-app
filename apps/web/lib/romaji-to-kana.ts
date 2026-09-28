const romajiToKana: Record<string, string> = {
  ltsu: "っ", xtsu: "っ", lya: "ゃ", xya: "ゃ", lyu: "ゅ", xyu: "ゅ", lyo: "ょ", xyo: "ょ",
  la: "ぁ", xa: "ぁ", li: "ぃ", xi: "ぃ", lu: "ぅ", xu: "ぅ", le: "ぇ", xe: "ぇ", lo: "ぉ", xo: "ぉ",
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", sha: "しゃ", shu: "しゅ", sho: "しょ", cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ", hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ", bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ", ja: "じゃ", ju: "じゅ", jo: "じょ", tsu: "つ",
  a: "あ", i: "い", u: "う", e: "え", o: "お", ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ", ta: "た", ti: "ち", chi: "ち", tu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の", ha: "は", hi: "ひ", hu: "ふ", fu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も", ya: "や", yu: "ゆ", yo: "よ", ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご", za: "ざ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど", ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ", pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
}

const romajiKeys = Object.keys(romajiToKana).sort((left, right) => right.length - left.length)

export function convertRomajiToKana(value: string) {
  let result = ""
  let index = 0
  const lowerValue = value.toLocaleLowerCase()

  while (index < lowerValue.length) {
    const remaining = lowerValue.slice(index)
    if (remaining.startsWith("nn")) {
      result += "ん"
      index += 2
      continue
    }
    if (remaining.startsWith("n") && remaining[1] && !/[aiueoyn]/.test(remaining[1])) {
      result += "ん"
      index += 1
      continue
    }
    if (remaining.length > 1 && remaining[0] === remaining[1] && /[bcdfghjklmpqrstvwxyz]/.test(remaining[0]!)) {
      result += "っ"
      index += 1
      continue
    }

    const match = romajiKeys.find((key) => remaining.startsWith(key))
    if (!match) {
      result += value[index]
      index += 1
      continue
    }
    result += romajiToKana[match]
    index += match.length
  }

  return result
}