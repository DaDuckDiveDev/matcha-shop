import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Card, T } from '../components/ui';
import { C, F } from '../theme';
import { cartLines, cartTotal, store, useStore } from '../store';
import { useLang } from '../i18n';
import { CATEGORIES, byCategory, fmtRsd, unitPrice } from '../shared/menu';
import { pointsFor } from '../shared/loyalty';
import { isOpen } from '../shared/shop';

const SLOTS = [
  { id: 'now', en: 'Now · ~8 min', sr: 'Sada · ~8 min' },
  { id: '15', en: 'In 15 min', sr: 'Za 15 min' },
  { id: '30', en: 'In 30 min', sr: 'Za 30 min' }
];

export default function Order() {
  const { cart, lastOrder } = useStore();
  const { pick, n } = useLang();
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [slot, setSlot] = useState('now');
  const [placed, setPlaced] = useState(null);
  const lines = cartLines(cart);
  const total = cartTotal(cart);
  const qty = (id) => cart.find((c) => c.itemId === id)?.qty || 0;
  const opened = isOpen();

  const confirm = () => { const o = store.placeOrder(pick(SLOTS.find((x) => x.id === slot))); if (o) setPlaced(o); };

  if (placed && lastOrder?.id === placed.id) {
    return (
      <View style={{ gap: 14 }}>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Text style={T.kicker}>{pick({ en: 'Order', sr: 'Porudžbina' })}</Text>
          <Text style={{ fontFamily: F.serif, fontSize: 56, lineHeight: 60, color: C.ink, letterSpacing: 2 }}>{placed.id}</Text>
          <Text style={[T.jp, { fontSize: 18 }]}>受付</Text>
          <Text style={[T.body, { textAlign: 'center' }]}>{pick({ en: 'We have your order. The water is on.', sr: 'Imamo tvoju porudžbinu. Voda se greje.' })}</Text>
          <Text style={T.meta}>{fmtRsd(placed.total)} RSD · +{n(placed.pts)} {pick({ en: 'points', sr: 'poena' })} · {placed.pickup}</Text>
        </Card>
        <Button kind="ghost" label={pick({ en: 'New order', sr: 'Nova porudžbina' })} onPress={() => setPlaced(null)} />
      </View>
    );
  }

  return (
    <View style={{ gap: 14 }}>
      <View style={{ paddingVertical: 8, gap: 6 }}>
        <Text style={T.h1}>{pick({ en: 'Order ahead', sr: 'Naruči unapred' })}</Text>
        <Text style={T.meta}>{pick({ en: 'Pick up at the counter. We start whisking when you confirm.', sr: 'Preuzmi na šanku. Počinjemo da mutimo kad potvrdiš.' })}</Text>
      </View>
      {!opened && <Text style={{ backgroundColor: C.foam, color: C.ujiDeep, fontFamily: F.sans, fontSize: 13, lineHeight: 18, padding: 12, borderRadius: 14, overflow: 'hidden' }}>{pick({ en: 'Preview. Orders made here are not sent to the shop.', sr: 'Probna verzija. Porudžbine odavde ne stižu u radnju.' })}</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.id} accessibilityRole="button" accessibilityState={{ selected: cat === c.id }} onPress={() => setCat(c.id)}
            style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: cat === c.id ? C.ink : C.line, backgroundColor: cat === c.id ? C.ink : C.white, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontFamily: F.serif, fontSize: 13, color: cat === c.id ? C.paper : C.uji }}>{c.kanji}</Text>
            <Text style={{ fontFamily: F.medium, fontSize: 15, color: cat === c.id ? C.paper : C.ink }}>{pick(c)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Card style={{ gap: 0, paddingVertical: 6 }}>
        {byCategory(cat).map((item, i) => (
          <View key={item.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 14, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[T.title, { fontSize: 20, lineHeight: 24 }]}>{pick(item.name)} {item.jp ? <Text style={[T.jp, { fontSize: 13 }]}>{item.jp}</Text> : null}</Text>
              {item.note ? <Text style={T.meta}>{pick(item.note)}</Text> : null}
              <Text style={[T.meta, { color: C.ink }]}>{fmtRsd(unitPrice(item, {}))} RSD</Text>
            </View>
            {qty(item.id) > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel={pick({ en: 'One fewer', sr: 'Jedan manje' })} onPress={() => store.remove(item.id)} style={st.round}><Text style={st.roundText}>−</Text></Pressable>
            )}
            {qty(item.id) > 0 && <Text style={{ fontFamily: F.semi, fontSize: 16, color: C.ink, minWidth: 14, textAlign: 'center' }}>{qty(item.id)}</Text>}
            <Pressable accessibilityRole="button" accessibilityLabel={pick({ en: 'Add', sr: 'Dodaj' })} onPress={() => store.add(item.id)} style={[st.round, { backgroundColor: C.uji, borderColor: C.uji }]}><Text style={[st.roundText, { color: C.onUji }]}>+</Text></Pressable>
          </View>
        ))}
      </Card>

      {lines.length > 0 && (
        <Card>
          <Text style={T.title}>{pick({ en: 'Your order', sr: 'Tvoja porudžbina' })}</Text>
          {lines.map((l) => (
            <View key={l.itemId} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={T.body}>{l.qty} × {pick(l.item.name)}</Text>
              <Text style={[T.body, { color: C.ink }]}>{fmtRsd(unitPrice(l.item, l.choice) * l.qty)}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {SLOTS.map((x) => (
              <Pressable key={x.id} accessibilityRole="button" accessibilityState={{ selected: slot === x.id }} onPress={() => setSlot(x.id)}
                style={{ flex: 1, minHeight: 46, borderRadius: 999, borderWidth: 1, borderColor: slot === x.id ? C.uji : C.line, backgroundColor: slot === x.id ? C.uji : C.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                <Text style={{ fontFamily: F.medium, fontSize: 13, color: slot === x.id ? C.onUji : C.ink }} numberOfLines={1}>{pick(x)}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={T.meta}>{pick({ en: `This order earns ${n(pointsFor(total))} points and a stamp for each drink.`, sr: `Ova porudžbina donosi ${n(pointsFor(total))} poena i pečat za svako piće.` })}</Text>
          <Button label={`${pick({ en: 'Confirm order', sr: 'Potvrdi porudžbinu' })} · ${fmtRsd(total)} RSD`} onPress={confirm} />
        </Card>
      )}
    </View>
  );
}

const st = {
  round: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  roundText: { fontFamily: F.medium, fontSize: 20, lineHeight: 22, color: C.ink }
};
