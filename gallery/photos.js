// Demo photo data — later replace with: fetch('gallery/index.json').then(r => r.json())
const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc80?w=900&auto=format&fit=crop', cap: '傍晚的花店，光线很低', ratio: 1.3, source: 'https://unsplash.com/photos/U2BI3GMnSSE' },
  { src: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=900&auto=format&fit=crop', cap: '雨后的街道，积水里有整片天空', ratio: 0.7, source: 'https://unsplash.com/photos/jpUiSdHAuQM' },
  { src: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=900&auto=format&fit=crop', cap: '路灯映在水面，比真实的更亮', ratio: 1.4, source: 'https://unsplash.com/photos/Z3ownETsdNQ' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop', cap: '安静的下午', ratio: 0.75, source: 'https://unsplash.com/photos/Ehk0wsxXpAA' },
  { src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=900&auto=format&fit=crop', cap: '城市边缘', ratio: 1.1, source: 'https://unsplash.com/photos/cdM_GwYwCpQ' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&auto=format&fit=crop', cap: '云的形状', ratio: 0.6, source: 'https://unsplash.com/photos/m_HRfLhgABo' },
  { src: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=900&auto=format&fit=crop', cap: '一个人的傍晚', ratio: 1.5, source: 'https://unsplash.com/photos/H4PHrIzwGfQ' },
  { src: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=900&auto=format&fit=crop', cap: '路过', ratio: 0.65, source: 'https://unsplash.com/photos/JzbBs9JsKtc' },
];
