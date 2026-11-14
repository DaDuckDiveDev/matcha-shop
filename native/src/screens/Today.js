import { Pressable, Text, View } from 'react-native';
import { Card, Stamps, T } from '../components/ui';
import { C, F } from '../theme';
import { useStore } from '../store';
import { useLang } from '../i18n';
import { standing } from '../shared/loyalty';
import { currentSekki } from '../shared/sekki';
import { PUBLISHED } from '../shared/journal';
import { SHOP, isOpen } from '../shared/shop';

export default function Today({ go }) {
  const { name, stamps, points, lifetime } = useStore();
  const { lang, pick, n, day } = useLang();
  const now = new Date();
  const h = now.getHours();
  const hello = h < 12 ? { en: 'Good morning', sr: 'Dobro jutro' } : h < 18 ? { en: 'Good afternoon', sr: 'Dobar dan' } : { en: 'Good evening', sr: 'Dobro veče' };
  const sekki = currentSekki(now);
  const { tier } = standing(lifetime);
  const opened = isOpen(now);

  return (
    <View style={{ gap: 14 }}>
      <View style={{ paddingVertical: 8, gap: 6 }}>
        <Text style={T.kicker}>{day(now, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        <Text style={T.h1}>{pick(hello)}{name ? `, ${name}` : ''}.</Text>
        <Text style={T.meta}><Text style={T.jp}>{sekki.kanji}</Text> {lang === 'sr' ? sekki.sr : sekki.en} · {opened ? pick({ en: `open ${SHOP.hours}`, sr: `otvoreno ${SHOP.hours}` }) : pick({ en: 'opens Saturday 20 March 2027', sr: 'otvaramo u subotu, 20. marta 2027.' })}</Text>
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={T.title}>{pick({ en: 'Stamp card', sr: 'Kartica pečata' })} <Text style={[T.jp, { fontSize: 14 }]}>判子</Text></Text>
          <Text style={T.kicker}>{Math.min(stamps, 10)} {pick({ en: 'of', sr: 'od' })} 10</Text>
        </View>
        <Stamps count={stamps} />
        <Pressable accessibilityRole="button" onPress={() => go('card')} style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 12 }}>
          <Text style={T.body}>{n(points)} {pick({ en: 'points', sr: 'poena' })} · {pick(tier.name)} <Text style={T.jp}>{tier.jp}</Text></Text>
          <Text style={[T.body, { color: C.ink }]}>→</Text>
        </Pressable>
      </Card>

      {sekki.special && (
        <Pressable accessibilityRole="button" onPress={() => go('order')}>
          <Card style={{ backgroundColor: C.foam, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Text style={{ fontFamily: F.serif, fontSize: 30, color: C.uji }}>{sekki.kanji}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={T.kicker}>{pick({ en: 'This fortnight', sr: 'Ove dve nedelje' })}</Text>
              <Text style={[T.title, { fontSize: 18, lineHeight: 23 }]}>{lang === 'sr' ? sekki.special.sr : sekki.special.en}</Text>
            </View>
          </Card>
        </Pressable>
      )}

      <Card>
        <Text style={T.title}>{pick({ en: 'From the journal', sr: 'Iz priča' })}</Text>
        {PUBLISHED.slice(0, 3).map((st, i) => (
          <View key={st.slug} style={{ gap: 3, paddingTop: i ? 12 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
            <Text style={T.kicker}>{pick(st.kicker)} · {st.minutes} min</Text>
            <Text style={[T.title, { fontSize: 19, lineHeight: 24 }]}>{pick(st.title)}</Text>
            <Text style={T.meta}>{pick(st.excerpt)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}
