import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { C, F, R, shadow } from '../theme';

// The mark: a bowl of usucha from above (the same path as the website's logo).
export const MARK_PATH = 'M47 12 C68 9 91 27 90 50 C89 72 74 86 50 86 C26 86 10 73 10.5 50 C11 28 27 14 47 12 Z';
export function Mark({ size = 24, color = C.uji }) {
  return <Svg width={size} height={size} viewBox="0 0 100 100"><Path d={MARK_PATH} fill={color} /></Svg>;
}

export function Card({ children, style, green }) {
  return <View style={[s.card, green && s.cardGreen, style]}>{children}</View>;
}

export function Button({ label, onPress, kind = 'solid', small, disabled, style }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.btn, small && s.btnSmall, kind === 'solid' ? s.btnSolid : s.btnGhost, pressed && { opacity: 0.85 }, disabled && { opacity: 0.5 }, style]}>
      <Text style={[s.btnText, small && { fontSize: 15 }, kind === 'solid' ? { color: C.onUji } : { color: C.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function TierRing({ progress = 0, kanji, size = 96 }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Circle cx="50" cy="50" r={r} fill="none" stroke="rgba(246,244,236,0.2)" strokeWidth="3" />
        <Circle cx="50" cy="50" r={r} fill="none" stroke="#C9DBA8" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${Math.max(0.001, progress) * c} ${c}`} transform="rotate(-90 50 50)" />
      </Svg>
      <Text style={{ fontFamily: F.serif, fontSize: size * 0.22, color: '#C9DBA8' }}>{kanji}</Text>
    </View>
  );
}

export function Stamps({ count }) {
  return (
    <View style={s.stamps}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={[s.stamp, i < count && s.stampOn, i === 9 && i >= count && { borderColor: C.leaf }]}>
          {i < count ? <Mark size={20} color={C.foam} /> : i === 9 ? <Text style={{ fontFamily: F.serif, fontSize: 12, color: C.uji }}>薄茶</Text> : null}
        </View>
      ))}
    </View>
  );
}

export const T = StyleSheet.create({
  h1: { fontFamily: F.serif, fontSize: 34, lineHeight: 38, color: C.ink },
  title: { fontFamily: F.serif, fontSize: 22, lineHeight: 26, color: C.ink },
  body: { fontFamily: F.sans, fontSize: 16, lineHeight: 23, color: C.ink2 },
  meta: { fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: C.ink2 },
  kicker: { fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: C.ink3 },
  num: { fontFamily: F.serif, fontVariant: ['tabular-nums'] },
  jp: { fontFamily: F.serif, color: C.uji }
});

const s = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: R.m, padding: 20, gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(22,25,21,0.08)', ...shadow },
  cardGreen: { backgroundColor: C.ujiDeep, borderColor: C.ujiDeep },
  btn: { minHeight: 52, paddingHorizontal: 26, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  btnSmall: { minHeight: 44, paddingHorizontal: 18 },
  btnSolid: { backgroundColor: C.uji },
  btnGhost: { borderWidth: 1, borderColor: 'rgba(22,25,21,0.2)' },
  btnText: { fontFamily: F.medium, fontSize: 16 },
  stamps: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stamp: { width: '17.2%', aspectRatio: 1, borderRadius: 999, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BDBAAD', alignItems: 'center', justifyContent: 'center' },
  stampOn: { backgroundColor: C.ujiDeep, borderWidth: 0 }
});
