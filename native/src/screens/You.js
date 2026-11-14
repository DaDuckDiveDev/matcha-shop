import { Pressable, Text, TextInput, View } from 'react-native';
import { Card, T } from '../components/ui';
import { C, F } from '../theme';
import { store, useStore } from '../store';
import { useLang } from '../i18n';
import { TIERS, standing } from '../shared/loyalty';
import { findItem, fmtRsd } from '../shared/menu';

export default function You() {
  const { name, lang, stamps, points, lifetime, orders } = useStore();
  const { pick, n, day } = useLang();
  const { tier } = standing(lifetime);
  const tiles = [
    [n(points), pick({ en: 'Points to use', sr: 'Poena za korišćenje' })],
    [n(lifetime), pick({ en: 'Points earned', sr: 'Ukupno zarađeno' })],
    [`${Math.min(stamps, 10)}/10`, pick({ en: 'Stamps', sr: 'Pečata' })],
    [n(orders.length), pick({ en: 'Orders', sr: 'Porudžbina' })]
  ];
  return (
    <View style={{ gap: 14 }}>
      <View style={{ paddingVertical: 8, gap: 6 }}>
        <Text style={T.h1}>{name || pick({ en: 'You', sr: 'Ti' })}</Text>
        <Text style={T.meta}>{pick(tier.name)} <Text style={T.jp}>{tier.jp}</Text> · {pick({ en: 'kept on this phone', sr: 'čuva se na ovom telefonu' })}</Text>
      </View>

      <Card>
        <Text style={T.kicker}>{pick({ en: 'The name we call at the counter', sr: 'Ime koje prozivamo na šanku' })}</Text>
        <TextInput value={name} onChangeText={store.setName} maxLength={40} autoComplete="given-name" accessibilityLabel={pick({ en: 'Your name', sr: 'Tvoje ime' })}
          style={{ height: 52, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, paddingHorizontal: 16, fontFamily: F.sans, fontSize: 17, color: C.ink }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[['en', 'English'], ['sr', 'Srpski']].map(([id, label]) => (
            <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: lang === id }} onPress={() => store.setLang(id)}
              style={{ flex: 1, minHeight: 46, borderRadius: 999, borderWidth: 1, borderColor: lang === id ? C.ink : C.line, backgroundColor: lang === id ? C.ink : C.white, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.medium, fontSize: 15, color: lang === id ? C.paper : C.ink }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {tiles.map(([v, k]) => (
          <Card key={k} style={{ width: '47.8%', gap: 4, padding: 18 }}>
            <Text style={{ fontFamily: F.serif, fontSize: 34, lineHeight: 38, color: C.ink }}>{v}</Text>
            <Text style={T.meta}>{k}</Text>
          </Card>
        ))}
      </View>

      <Card>
        <Text style={T.title}>{pick({ en: 'Tiers', sr: 'Nivoi' })}</Text>
        {TIERS.map((x, i) => {
          const now = x.id === tier.id;
          const reached = lifetime >= x.from;
          return (
            <View key={x.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingTop: i ? 12 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: now ? C.ujiDeep : reached ? C.foam : C.white, borderWidth: now || reached ? 0 : 1, borderColor: C.line }}>
                <Text style={{ fontFamily: F.serif, fontSize: 13, color: now ? C.onUji : reached ? C.ujiDeep : C.ink3 }}>{x.jp}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[T.title, { fontSize: 19, lineHeight: 23 }]}>{pick(x.name)}{now ? ` · ${pick({ en: 'you are here', sr: 'ovde si' })}` : ''}</Text>
                <Text style={T.meta}>{pick(x.perk)}</Text>
              </View>
              <Text style={T.kicker}>{x.from === 0 ? '' : n(x.from)}</Text>
            </View>
          );
        })}
      </Card>

      <Card>
        <Text style={T.title}>{pick({ en: 'Orders', sr: 'Porudžbine' })}</Text>
        {orders.length === 0
          ? <Text style={T.meta}>{pick({ en: 'Nothing ordered from this phone yet.', sr: 'Sa ovog telefona još ništa nije naručeno.' })}</Text>
          : orders.slice(0, 6).map((o, i) => (
            <View key={`${o.id}-${o.at}`} style={{ flexDirection: 'row', gap: 12, paddingTop: i ? 10 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
              <Text style={[T.kicker, { width: 56 }]}>{day(o.at)}</Text>
              <Text style={[T.body, { flex: 1, fontSize: 15 }]}>{o.items.map((it) => `${it.qty > 1 ? `${it.qty} × ` : ''}${pick(findItem(it.itemId)?.name) || it.itemId}`).join(', ')}</Text>
              <Text style={[T.body, { fontSize: 15, color: C.ink }]}>{fmtRsd(o.total)}</Text>
            </View>
          ))}
      </Card>
    </View>
  );
}
