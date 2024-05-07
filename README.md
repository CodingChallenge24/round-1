# [Olympus](https://lts20050703.srht.site/link/olympus): Đường Lên Đỉnh Olympus, không phải chương trình Đường Lên Đỉnh O giấu tên

## Programmer: [LTS20050703](https://lts20050703.srht.site)

## Control Panel Design, User Interface & Experience: [TwoQuantumBits](https://2qb.bio.link)

## Font: [Hylia Serif](https://artsyomni.com/hyliaserif)

## License: [Affero GNU Public License versio n 3](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Get started

1. `git clone https://git.sr.ht/~lts20050703/olympus`
2. `cd olympus`
3. `npm install --legacy-peer-deps`
4. `npx vite --host`
5. Launch any chromium based browser with the following flags

- `--disable-background-timer-throttling`: Disable timers being throttled in background pages/tabs
- `--disable-backgrounding-occluded-windows`: Normally, Chrome will treat a 'foreground' tab instead as backgrounded if the surrounding window is occluded (aka visually covered) by another window. This flag disables that.
- `--disable-features=CalculateNativeWinOcclusion`: Disable the feature of: Calculate window occlusion on Windows will be used in the future to throttle and potentially unload foreground tabs in occluded windows.
- `--disable-hang-monitor`: Suppresses hang monitor dialogs in renderer processes. This flag may allow slow unload handlers on a page to prevent the tab from closing.
- `--disable-renderer-backgrounding`: This disables non-foreground tabs from getting a lower process priority This doesn't (on its own) affect timers or painting behavior.

For example, if you have installed Brave Browser:

- Windows (powershell): `& 'C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe' 'http://localhost:5173/' --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion --disable-hang-monitor --disable-renderer-backgrounding`

- Linux (sh): `/usr/bin/brave-browser 'http://localhost:5173/' --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion --disable-hang-monitor --disable-renderer-backgrounding`

Flags retrieved from <https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md#task-throttling>
