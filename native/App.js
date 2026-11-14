import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { HinaMincho_400Regular } from '@expo-google-fonts/hina-mincho/400Regular';
// One import per weight, so only these four font files ship in the app.
import { HankenGrotesk_400Regular } from '@expo-google-fonts/hanken-grotesk/400Regular';
import { HankenGrotesk_500Medium } from '@expo-google-fonts/hanken-grotesk/500Medium';
import { HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk/600SemiBold';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, shadow } from './src/theme';
import { Mark } from './src/components/ui';
import { hydrate, useStore } from './src/store';
import { useLang } from './src/i18n';
import Today from './src/screens/Today';
import Order from './src/screens/Order';
import CardScreen from './src/screens/CardScreen';
import You from './src/screens/You';

// Four tabs in a floating bar, as in the web app. Each tab is named by a kanji
// and a word: 今 today, 注 order, 判 the card, 私 you.
const TABS = [
  { id: 'today', kanji: '今', label: { en: 'Today', sr: 'Danas' }, Screen: Today },
  { id: 'order', kanji: '注', label: { en: 'Order', sr: 'Naruči' }, Screen: Order },
  { id: 'card', kanji: '判', label: { en: 'Card', sr: 'Kartica' }, Screen: CardScreen },
  { id: 'you', kanji: '私', label: { en: 'You', sr: 'Ti' }, Screen: You }
];

function Shell() {
  const insets = useSafeAreaInsets();
  const { cart } = useStore();
  const { pick } = useLang();
  const [tab, setTab] = useState('today');
  const scroll = useRef(null);
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const { Screen } = TABS.find((t) => t.id === tab);
  const go = (id) => { setTab(id); scroll.current?.scrollTo({ y: 0, animated: false }); };

  return (
    <View style={{ flex: 1, backgroundColor: C.panel }}>
      <StatusBar style="dark" />
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: insets.bottom + 110, gap: 14, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 }}>
          <Mark size={24} />
          <Text style={{ fontFamily: F.serif, fontSize: 21, color: C.ink }}>Machiko</Text>
        </View>
        <Screen go={go} />
      </ScrollView>
      <View accessibilityRole="tablist" style={[{ position: 'absolute', left: 12, right: 12, bottom: insets.bottom + 10, height: 66, borderRadius: 33, backgroundColor: 'rgba(255,255,255,0.96)', flexDirection: 'row', paddingHorizontal: 6, maxWidth: 536, alignSelf: 'center' }, shadow]}>
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <Pressable key={t.id} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={pick(t.label)} onPress={() => go(t.id)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Text style={{ fontFamily: F.serif, fontSize: 18, lineHeight: 22, color: on ? C.ujiDeep : C.ink3 }}>{t.kanji}</Text>
              <Text style={{ fontFamily: F.medium, fontSize: 11, color: on ? C.ujiDeep : C.ink3 }}>{pick(t.label)}</Text>
              {t.id === 'order' && count > 0 && (
                <View style={{ position: 'absolute', top: 8, right: '22%', minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.uji, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                  <Text style={{ fontFamily: F.medium, fontSize: 11, color: C.onUji }}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const [fonts] = useFonts({ HinaMincho_400Regular, HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold });
  const { ready } = useStore();
  useEffect(() => { hydrate(); }, []);
  if (!fonts || !ready) return <View style={{ flex: 1, backgroundColor: C.paper }} />;
  return <SafeAreaProvider><Shell /></SafeAreaProvider>;
}
