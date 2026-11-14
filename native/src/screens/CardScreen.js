import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Stamps, T, TierRing } from '../components/ui';
import { C, F } from '../theme';
import { store, useStore } from '../store';
import { useLang } from '../i18n';
import { REWARDS, RSD_PER_POINT, standing } from '../shared/loyalty';

export default function CardScreen() {
  const { stamps, points, lifetime, ledger } = useStore();
  const { pick, n, day } = useLang();
  const [claimed, setClaimed] = useState(null);
  const { tier, next, progress, toNext } = standing(lifetime);
  const rewardName = (id) => { const r = REWARDS.find((x) => x.id === id); return r ? pick(r.name) : id; };

  return (
    <View style={{ gap: 14 }}>
      <View style={{ paddingVertical: 8, gap: 6 }}>
        <Text style={T.h1}>{pick({ en: 'Stamps and points', sr: 'Pečati i poeni' })}</Text>
        <Text style={T.meta}>{pick({ en: `Every drink earns a stamp. Every ${RSD_PER_POINT} RSD earns a point.`, sr: `Svako piće donosi pečat. Svakih ${RSD_PER_POINT} RSD donosi poen.` })}</Text>
      </View>

      <Card green style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <TierRing progress={progress} kanji={tier.jp} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: F.sans, fontSize: 13, color: C.onUjiSoft }}>{pick({ en: 'Your points', sr: 'Tvoji poeni' })}</Text>
          <Text style={{ fontFamily: F.serif, fontSize: 48, lineHeight: 52, color: C.onUji }}>{n(points)}</Text>
          <Text style={{ fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: C.onUjiSoft }}>
            {pick(tier.name)} {tier.jp}{next ? ` · ${pick({ en: `${n(toNext)} to ${pick(next.name)}`, sr: `još ${n(toNext)} do nivoa ${pick(next.name)}` })}` : ''}
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={T.title}>{pick({ en: 'Stamp card', sr: 'Kartica pečata' })} <Text style={[T.jp, { fontSize: 14 }]}>判子</Text></Text>
          <Text style={T.kicker}>{Math.min(stamps, 10)} {pick({ en: 'of', sr: 'od' })} 10</Text>
        </View>
        <Stamps count={stamps} />
        {stamps >= 10
          ? <Button label="薄茶 · usucha" onPress={() => store.redeemStamps()} />
          : <Text style={T.body}>{pick({ en: `${10 - stamps} more and the next usucha is on the house.`, sr: `Još ${10 - stamps} i sledeća usucha je na račun kuće.` })}</Text>}
      </Card>

      <Card>
        <Text style={T.title}>{pick({ en: 'Rewards', sr: 'Nagrade' })} <Text style={[T.jp, { fontSize: 14 }]}>御礼</Text></Text>
        {claimed && <Text style={{ backgroundColor: C.foam, color: C.ujiDeep, fontFamily: F.sans, fontSize: 13, lineHeight: 18, padding: 12, borderRadius: 14, overflow: 'hidden' }}>{pick({ en: `${pick(claimed.name)}: show this screen at the counter.`, sr: `${pick(claimed.name)}: pokaži ovaj ekran na šanku.` })}</Text>}
        {REWARDS.map((r, i) => (
          <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: i ? 12 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[T.title, { fontSize: 19, lineHeight: 23 }]}>{pick(r.name)}</Text>
              <Text style={T.meta}>{n(r.cost)} {pick({ en: 'points', sr: 'poena' })}</Text>
            </View>
            {points >= r.cost
              ? <Button small kind="ghost" label={pick({ en: 'Use', sr: 'Iskoristi' })} onPress={() => { store.redeemReward(r); setClaimed(r); }} />
              : <Text style={T.kicker}>{pick({ en: `${n(r.cost - points)} to go`, sr: `još ${n(r.cost - points)}` })}</Text>}
          </View>
        ))}
      </Card>

      <Card>
        <Text style={T.title}>{pick({ en: 'Activity', sr: 'Aktivnost' })}</Text>
        {ledger.length === 0
          ? <Text style={T.meta}>{pick({ en: 'Your first order starts the list.', sr: 'Prva porudžbina otvara listu.' })}</Text>
          : ledger.slice(0, 12).map((e, i) => (
            <View key={e.id} style={{ flexDirection: 'row', gap: 12, paddingTop: i ? 10 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
              <Text style={[T.kicker, { width: 56 }]}>{day(e.at)}</Text>
              <Text style={[T.body, { flex: 1, fontSize: 15 }]}>{e.kind === 'reward' ? rewardName(e.ref) : `${pick({ en: 'Order', sr: 'Porudžbina' })} ${e.ref}`}</Text>
              <Text style={{ fontFamily: F.semi, fontSize: 15, color: e.pts < 0 ? C.ink2 : C.uji }}>{e.pts > 0 ? '+' : '−'}{n(Math.abs(e.pts))}</Text>
            </View>
          ))}
      </Card>
    </View>
  );
}
