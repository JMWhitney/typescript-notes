class KeyValuePair<TKey, TValue> {
  constructor(
    public key: TKey,
    public value: TValue
  ) {}
}

  let pair1 = new KeyValuePair<number, string>(1, 'First');
  let pair2 = new KeyValuePair<string, Date>('Second', new Date(Date.now()));
  let pair3 = new KeyValuePair<number, string>(3, 'Third');

  class KeyValuePairPrinter<T, U> {

    //Pass reference to an array of key-value pairs of type T and U.
    constructor(private pairs: KeyValuePair<T, U>[]) { }

    //Iterate through the array and print each key-value property.
    print() {
      for(let p of this.pairs) {
        console.log(`${p.key}: ${p.value}`)
      }
    }
  }

  var printer = new KeyValuePairPrinter([ pair1, pair3 ]); 
  printer.print(); // 1: 'First' 3: 'Third'
