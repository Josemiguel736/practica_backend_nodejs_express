export default function avg (listNum) {
  return listNum.reduce((pre, cur) => pre + cur, 0) / listNum.length
}
