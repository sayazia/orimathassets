# Revises a screenshot of the Numeria Arena main menu (1600x900):
#  - the curved connector lines between the PLAY / YOU blocks and the book become straight lines
#    with right-angle bends (no curves), ending on the same anchor squares at the book;
#  - the lines run on to the edge of the book's pages and end there on a square in the colour of
#    their block (left group) or of the block's icon tile (right group);
#  - the line and dot from the hint text down to the sun are removed;
#  - the purple disc inside the sun turns a soft brick red (not glaring), keeping its two tones;
#  - the blocks lose their all-round drop shadow and take the global sticker peel effect
#    (style D, scripts/2d/menu.mjs): one side stays stuck down, the outer side lifts with a soft
#    tinted shadow, the left side for the left group and the right side for the right group.
# The old lines and shadows are removed by inpainting the blurred background.
# Run: pip install pillow numpy opencv-python-headless
#      python3 scripts/tools/revise-menu.py menu.webp out.png
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
img = np.array(Image.open(src).convert('RGB'))
H, W = img.shape[:2]

# blocks (x0, y0, x1, y1 inclusive) and the anchor squares on the book they connect to
TOPS = [360, 450, 540, 630]
LEFT = [(40, y, 389, y + 77) for y in TOPS]
RIGHT = [(1210, y, 1559, y + 77) for y in TOPS]
# heights where the lines meet the book (the old anchor squares); x is found on the page edge below
ANCHOR_Y = [609, 654, 701, 748]
TOOLTIP = (213, 528, 392, 550)        # "Enter your student code first", pasted back as it is
OVERFLOW = (390, 645, 398, 668)       # the D of SMARTBOARD sticks out of its block

orig = img.copy()


# sun disc: purple -> soft brick red, same brightness steps so the two halves still read
hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(float)
reg = np.zeros((H, W), bool); reg[370:560, 710:910] = True
purple = reg & (hsv[..., 0] > 118) & (hsv[..., 0] < 165) & (hsv[..., 1] > 12)
hsv[..., 0][purple] = 2                                            # red, a touch towards orange
hsv[..., 1][purple] = np.minimum(hsv[..., 1][purple] * 2.3, 140)  # about 0.5 saturation: muted, not glaring
hsv[..., 2][purple] *= 0.93
img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)
orig = np.where(purple[..., None], img, orig)
blur = cv2.medianBlur(img, 21).astype(int)
diff = np.abs(img.astype(int) - blur).sum(-1)

mask = np.zeros((H, W), np.uint8)
# old drop shadows: a ring round every block
for x0, y0, x1, y1 in LEFT + RIGHT:
    mask[y0 - 5:y1 + 15, x0 - 7:x1 + 13] = 255
# old curved lines and their anchor squares, kept off the book
for (xa, xb) in [(386, 462), (1138, 1214)]:
    sub = diff[388:760, xa:xb] > 28
    mask[388:760, xa:xb][sub] = 255
mask = cv2.dilate(mask, np.ones((5, 5), np.uint8))
# the blocks themselves are masked too, so the fill only borrows background colour (they go back on top)
for x0, y0, x1, y1 in LEFT + RIGHT + [TOOLTIP]:
    mask[y0:y1 + 1, x0:x1 + 1] = 255
# line from the hint text down to the sun, and its dot on the sun's top point
mask[257:348, 788:814] = 255   # the line and its soft shadow
mask[344:359, 792:809] = 255
book = np.zeros((H, W), np.uint8)
cv2.fillPoly(book, [np.array([[440, 742], [800, 560], [1160, 742], [1205, 790], [400, 790]])], 255)
mask[book > 0] = 0
# the old anchor squares at the bottom corners sit on the book's edge
mask[741:756, 426:441] = 255
mask[741:756, 1163:1178] = 255
# Fill the holes with the blurred background around them (normalised convolution). Only plain
# background counts: light paper (book pages, text boxes, lines) and dark parts (the sun) are left
# out, so nothing bright or dark bleeds into the fill.
tot = orig.astype(int).sum(-1)
wgt = ((mask == 0) & (tot > 330) & (tot < 640)).astype(np.float32)
clean = img.astype(np.float32)
for sigma in (10, 24, 60):
    num = cv2.GaussianBlur(clean * wgt[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(wgt, (0, 0), sigma)[..., None]
    fill = num / np.maximum(den, 1e-6)
    todo = (mask > 0) & (den[..., 0] > 0.02)
    clean[todo] = fill[todo]
    wgt = np.maximum(wgt, todo.astype(np.float32))
    mask = np.where(todo, 0, mask).astype(np.uint8)
clean = clean.astype(np.uint8)
base = Image.fromarray(clean.astype(np.uint8))

def page_edge(y, x_from, step):
    # first page pixel (light cream) along row y of the cleaned image, walking towards the book
    row = np.array(base)[y].astype(int).sum(-1)
    x = x_from
    while row[x] <= 690: x += step
    return x
ANCHOR_L = [(page_edge(y, 400, 1) - 1, y) for y in ANCHOR_Y]
ANCHOR_R = [(page_edge(y, 1205, -1) + 1, y) for y in ANCHOR_Y]
print('anchors', ANCHOR_L, ANCHOR_R)
# the sun's top point, which sat under the removed dot
ImageDraw.Draw(base).polygon([(800, 351), (787, 364), (813, 364)], fill=tuple(int(v) for v in orig[368, 800]))
# dot colours: the block itself on the left, the icon tile on the right
DOT_L = [tuple(int(v) for v in orig[y0 + 10, 380]) for (_, y0, _, _) in LEFT]
DOT_R = [tuple(int(v) for v in orig[y0 + 15, 1236]) for (_, y0, _, _) in RIGHT]

def shade_of(x0, y0, x1, y1):
    # the background under a block, darkened 42%: the shadow is tinted, never black (menu.mjs)
    c = np.array(base)[y1 + 6:y1 + 20, x0:x1].reshape(-1, 3).mean(0)
    return tuple(int(v * 0.58) for v in c)

def peel(layer, block, side):
    # style D peel shadow, mirrored for a left lift: a wedge along the bottom growing from the fixed
    # side to the free corner and up the free side, a tighter second layer, a hairline on top
    x0, y0, x1, y1 = block
    w, h, lift = x1 - x0, y1 - y0, 15
    fx = (lambda t: x0 + w * t) if side == 'right' else (lambda t: x1 - w * t)
    out = 1 if side == 'right' else -1
    edge = x1 if side == 'right' else x0
    col = shade_of(*block)
    for pts, op, rad in [
        ([(fx(0.04), y1 - 3), (edge - out * 3, y0 + h * 0.12), (edge + out * lift * 0.45, y0 + h * 0.55),
          (edge + out * lift * 0.6, y1 + lift), (fx(0.5), y1 + lift * 0.45)], 0.42, 5),
        ([(fx(0.35), y1 - 2), (edge - out * 2, y0 + h * 0.6), (edge + out * lift * 0.3, y1 + lift * 0.55),
          (fx(0.75), y1 + lift * 0.3)], 0.3, 2),
    ]:
        sh = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sh).polygon(pts, fill=int(255 * op))
        sh = sh.filter(ImageFilter.GaussianBlur(rad))
        layer.paste(Image.new('RGB', (W, H), col), (0, 0), sh)
    hair = Image.new('L', (W, H), 0)
    ImageDraw.Draw(hair).rectangle((x0 + 3, y0 - 2, x1 - 3, y0 + 1), fill=int(255 * 0.12))
    layer.paste(Image.new('RGB', (W, H), col), (0, 0), hair.filter(ImageFilter.GaussianBlur(1)))

for b in LEFT: peel(base, b, 'left')
for b in RIGHT: peel(base, b, 'right')

# straight connector lines with right-angle bends: out from the block's inner edge, along to a lane,
# down to the anchor's height, across to the anchor. Top block takes the lane nearest the book, so
# no line crosses another.
LINE = (250, 246, 236)
d = ImageDraw.Draw(base)
def connect(blocks, anchors, dots, side):
    for i, ((x0, y0, x1, y1), (ax, ay), dot) in enumerate(zip(blocks, anchors, dots)):
        ym = (y0 + y1) // 2
        sx = x1 + 1 if side == 'left' else x0 - 1
        lane = (440 - 12 * i) if side == 'left' else (1160 + 12 * i)
        pts = [(sx, ym), (lane, ym), (lane, ay), (ax, ay)]
        d.line(pts, fill=LINE, width=3, joint=None)
        for (px, py) in pts[1:3]:
            d.rectangle((px - 1, py - 1, px + 1, py + 1), fill=LINE)
        d.rectangle((ax - 5, ay - 5, ax + 5, ay + 5), fill=dot)
connect(LEFT, ANCHOR_L, DOT_L, 'left')
connect(RIGHT, ANCHOR_R, DOT_R, 'right')

# blocks, the tooltip and the overflowing letter back on top, exactly as they were
res = np.array(base)
for x0, y0, x1, y1 in LEFT + RIGHT + [TOOLTIP]:
    res[y0:y1 + 1, x0:x1 + 1] = orig[y0:y1 + 1, x0:x1 + 1]
x0, y0, x1, y1 = OVERFLOW
reg = orig[y0:y1 + 1, x0:x1 + 1]
txt = reg.min(-1) > 225
res[y0:y1 + 1, x0:x1 + 1][txt] = reg[txt]
Image.fromarray(res).save(out)
print('saved', out)
