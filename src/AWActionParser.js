// import ohm from 'ohm-js';
import * as ohm from 'ohm-js';

const GRAMMAR_DEFINITION = `
ActionString {
  // Base syntax
  Actions   = ListOf<Action, ";"+> ";"?
  Action = Trigger ListOf<Command, ","+> ","?

  // Trigger index
  Trigger   = create
            | activate
            | bump
            | adone
            | end
  create    = caseInsensitive<"create">
  activate  = caseInsensitive<"activate">
  bump      = caseInsensitive<"bump">
  adone     = caseInsensitive<"adone">

  // Command index
  Command   = TextureCommand
            | AnimateCommand
            | SoundCommand
            | CoronaCommand
            | ColorCommand
            | ExamineCommand
            | SolidCommand
            | NameCommand
            | VisibleCommand
            | MoveCommand
            | RotateCommand
            | ScaleCommand
            | ShearCommand
            | LightCommand
            | NoiseCommand
            | OpacityCommand
            | AmbientCommand
            | DiffuseCommand
            | SpecularCommand
            | PictureCommand
            | MediaCommand
            | SayCommand
            | SeqCommand
            | SignCommand
            | TeleportCommand
            | WarpCommand
            | URLCommand
            | invalidCommand

  // Enabled / disabled string values
  enabled  = "on" | "true" | "yes"
  disabled = "off" | "false" | "no"
  booleanArgument = boolean
  boolean  = enabled | disabled

  // Mask status
  maskStatus = mask | nomask
  mask       = "mask"
  nomask     = "nomask"

  // Loop status
  loopStatus = loop | noloop
  loop       = "loop"
  noloop     = "noloop"

  // Sync status
  syncStatus = sync | nosync
  sync       = "sync"
  nosync     = "nosync"

  // Reset status
  resetStatus = reset | noreset
  reset       = "reset"
  noreset     = "noreset"

  // Resource target (textures, pictures, sounds, media, etc)
  // example: https://example.com/stone3.jpg
  resourceTarget = (alnum | "." | "/" | ":" | "_" | "-" | "+" | "%" | "?" | "=" | "[" | "]" | "&" | "~" | "!" | "@" | "*" | "(" | ")")+

  // Simple Basic resource target for textures, masks etc
  // example: stone3.jpg
  basicResourceTarget = (alnum | "." | "_" | "-")+

  // Command parameter (e.g. name=foo, tag=bar)
  namedParameter<paramName, paramSyntax> = paramName "=" paramSyntax

  // Command parameter syntax for parameters that can have a URL as a value
  //  (mask=https://...)
  namedURLParameter<paramName, paramSyntax> = paramName "=" paramSyntax

  // Name parameter
  nameParameter = namedParameter<caseInsensitive<"name">, objectName>
  nameArgument = objectName
  objectName = (alnum | "_" | "-")+

  // Invalid command (e.g. unsupported)
  invalidCommand = (~";" ~"," any)*

  // Generic command
  MultiArgumentCommand<commandName, CommandArgument> = commandName CommandArgument*

  // Name command
  NameCommand = MultiArgumentCommand<caseInsensitive<"name">, nameArgument>

  // Solid command
  SolidCommand = MultiArgumentCommand<caseInsensitive<"solid">, SolidArgument>
  SolidArgument = booleanArgument | nameArgument

  // Texture command
  TextureCommand = MultiArgumentCommand<caseInsensitive<"texture">, TextureArgument>
  TextureArgument = maskParameter | tagParameter | nameParameter | resourceTarget

  maskParameter = namedURLParameter<caseInsensitive<"mask">, maskName>
  maskName = resourceTarget

  // tagParameter = namedParameter<"tag", tagName>
  tagParameter = namedParameter<"tag", tagName>
  tagName = positiveInteger

  // Animate command
  AnimateCommand = MultiArgumentCommand<caseInsensitive<"animate">, AnimateArgument>
  AnimateArgument = tagParameter | maskStatus | nameArgument | animateTextureName
  animateTextureName = basicResourceTarget

  // Color command
  ColorCommand  = MultiArgumentCommand<caseInsensitive<"color">, ColorArgument>
  ColorArgument = nameParameter | tintArgument | colorArgument
  colorArgument = colorName
  colorName     = "#" | alnum+
  tintArgument = caseInsensitive<"tint">

  // Sound command
  SoundCommand    = MultiArgumentCommand<caseInsensitive<"sound">, SoundArgument>
  SoundArgument   = nameParameter | loopStatus | soundName
  soundName       = resourceTarget

  // Visible command
  VisibleCommand = MultiArgumentCommand<caseInsensitive<"visible">, VisibleArgument>
  VisibleArgument = booleanArgument | nameArgument

  // Move command
  MoveCommand = MultiArgumentCommand<caseInsensitive<"move">, MoveArgument>
  MoveArgument = MoveDistances
               | loopStatus
               | syncStatus
               | resetStatus
               | nameParameter
               | timeParameter
               | waitParameter
  MoveDistances = signedFloat+
  timeParameter = namedParameter<"time", float>
  waitParameter = namedParameter<"wait", float>
  sign = "+" | "-"
  float = digit* "." digit+ -- fract
        | digit+            -- whole
  signedFloat = sign? float
  forceSignedFloat = sign float

  // Rotate command
  RotateCommand = MultiArgumentCommand<caseInsensitive<"rotate">, RotateArgument>
  RotateArgument = RotateDistances
                 | syncStatus
                 | timeParameter
                 | loopStatus
                 | resetStatus
                 | waitParameter
                 | nameParameter
  RotateDistances = signedFloat+

  // Scale command
  ScaleCommand = MultiArgumentCommand<caseInsensitive<"scale">, ScaleArgument>
  ScaleArgument = ScaleFactor
                 | syncStatus
                 | timeParameter
                 | loopStatus
                 | resetStatus
                 | waitParameter
                 | nameParameter
  ScaleFactor = signedFloat+

  // Shear command
  ShearCommand = MultiArgumentCommand<caseInsensitive<"shear">, ShearArgument>
  ShearArgument = ShearFactor
                 | nameParameter
  ShearFactor = signedFloat+

  // Corona command
  CoronaCommand = MultiArgumentCommand<caseInsensitive<"corona">, CoronaArgument>
  CoronaArgument = maskParameter | sizeParameter | nameParameter | resourceTarget
  sizeParameter = namedParameter<"size", float>

  // Examine command
  ExamineCommand = caseInsensitive<"examine">

  // Light command
  LightCommand = MultiArgumentCommand<caseInsensitive<"light">, LightArgument>
  LightArgument = lightTypeParameter
                | colorParameter
                | brightnessParameter
                | radiusParameter
                | nameParameter
                | fxParameter
                | timeParameter
                | angleParameter
                | pitchParameter
  colorParameter      = namedParameter<caseInsensitive<"color">, colorName>
  lightTypeParameter  = namedParameter<caseInsensitive<"type">, lightType>
  lightType           = caseInsensitive<"point"> | caseInsensitive<"spot">
  brightnessParameter = namedParameter<caseInsensitive<"brightness">, float>
  radiusParameter     = namedParameter<caseInsensitive<"radius">, float>
  fxParameter         = namedParameter<caseInsensitive<"fx">, fxType>
  fxType              = caseInsensitive<"blink"> | caseInsensitive<"fadein"> | caseInsensitive<"fadeout"> | caseInsensitive<"fire"> | caseInsensitive<"flicker"> | caseInsensitive<"flash"> | caseInsensitive<"pulse">
  angleParameter      = namedParameter<"angle", float>
  pitchParameter      = namedParameter<"pitch", float>

  // Noise command
  NoiseCommand  = MultiArgumentCommand<caseInsensitive<"noise">, NoiseArgument>
  NoiseArgument = overlapStatus | resourceTarget
  overlapStatus = "overlap"

  // Opacity command
  OpacityCommand = MultiArgumentCommand<caseInsensitive<"opacity">, OpacityArgument>
  OpacityArgument = opacityValue | tagParameter | nameParameter
  opacityValue = signedFloat

  // Ambient command
  AmbientCommand = MultiArgumentCommand<caseInsensitive<"ambient">, AmbientArgument>
  AmbientArgument = intensityValue | tagParameter | nameParameter
  intensityValue = signedFloat

  // Diffuse command
  DiffuseCommand = MultiArgumentCommand<caseInsensitive<"diffuse">, DiffuseArgument>
  DiffuseArgument = intensityValue | tagParameter | nameParameter

  // Specular command
  SpecularCommand = MultiArgumentCommand<caseInsensitive<"specular">, SpecularArgument>
  SpecularArgument = intensityValue | tagParameter | nameParameter // TODO: Add shininessValue, alphaValue

  // Picture command
  PictureCommand  = MultiArgumentCommand<caseInsensitive<"picture">, PictureArgument>
  PictureArgument = updateParameter | nameParameter | resourceTarget
  updateParameter = namedParameter<"update", positiveInteger>
  positiveInteger = digit+

  // Media command
  MediaCommand  = MultiArgumentCommand<caseInsensitive<"media">, MediaArgument>
  MediaArgument = nameParameter | radiusParameter | resourceTarget

  // Say command
  SayCommand = MultiArgumentCommand<caseInsensitive<"say">, SayArgument>
  SayArgument = sayText
  sayText = signQuotedText | signUnquotedText
  sayStringQuote = "\\""
  sayUnquotedText = (~";" ~"," ~" " any)+
  sayQuotedText = sayStringQuote (~sayStringQuote any)* sayStringQuote?

  // Seq command
  // TODO: [loop OR time=time]
  SeqCommand  = MultiArgumentCommand<caseInsensitive<"seq">, SeqArgument>
  SeqArgument = seqName | loopStatus | nameParameter
  seqName = basicResourceTarget

  // Sign command
  SignCommand = MultiArgumentCommand<caseInsensitive<"sign">, SignArgument>
  SignArgument = colorParameter | bcolorParameter | nameParameter | signText
  bcolorParameter = namedParameter<caseInsensitive<"bcolor">, colorName>
  signText = signQuotedText | signUnquotedText
  signStringQuote = "\\""
  signUnquotedText = (~";" ~"," ~" " any)+
  signQuotedText = signStringQuote (~signStringQuote any)* signStringQuote?

  // Teleport command (TODO: check relative/absolute altitude behavior on AW)
  TeleportCommand  = caseInsensitive<"teleport"> worldName? WorldCoordinates?
  worldName        = ~digit (~";" ~"," ~" " ~signStringQuote any)+
  WorldCoordinates = (AbsoluteCoordinates | RelativeCoordinates) altitude? direction?
  RelativeCoordinates = forceSignedFloat forceSignedFloat
  AbsoluteCoordinates = nsCoordinate ewCoordinate

  nsCoordinate = float (northSign | southSign)
  ewCoordinate = float (eastSign | westSign)
  northSign = caseInsensitive<"N">
  southSign = caseInsensitive<"S">
  eastSign  = caseInsensitive<"E">
  westSign  = caseInsensitive<"W">
  altitude = sign? float caseInsensitive<"a">
  direction = positiveInteger

  // URL command
  URLCommand = MultiArgumentCommand<caseInsensitive<"url">, URLArgument>
  URLArgument = urlTargetParameter | resourceTarget
  urlTargetParameter = namedParameter<caseInsensitive<"target">, caseInsensitive<"aw_3d">>

  // Warp command
  WarpCommand = caseInsensitive<"warp"> WorldCoordinates
}
`;

// Some unwanted unicode characters can appear in propdumps
const UNWANTED_CHARS = /\x80|\x7F/g;
function cleanActionString(actionString) {
    return actionString.replace(UNWANTED_CHARS, '');
}

const clampScale = (value, min = 0.1) => Math.max(value, min);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function resolveCommand(commandName, commandArguments) {
    let command = {
        commandType: commandName,
    };
    for (const argument of commandArguments.children.map(c => c.parse())) {
        if (argument && argument.length == 2) {
            if (command[argument[0]] !== undefined) {
                // Can't set the same parameter multiple times
                return null;
            } else {
                command[argument[0]] = argument[1];
            }
        }
    }
    return command;
}

function resolveIncompleteCoordinates(coordinates) {
    let [x, y, z] = [coordinates[0], coordinates[1], coordinates[2]];

    if (coordinates.length === 1) {
        return {x: 0, y: x, z: 0};
    } else if (coordinates.length === 2) {
        return {x, y, z: 0};
    } else if (coordinates.length === 3) {
        return {x, y, z};
    } else {
        return {x: 0, y: 0, z: 0};
    }
}

function resolveIncompleteScaleCoordinates(coordinates) {
    let [x, y, z] = coordinates.map(value => clampScale(value));

    if (coordinates.length === 1) {
        return { x, y: x, z: x };
    } else if (coordinates.length === 2) {
        return { x, y, z: 1 };
    } else {
        return { x, y, z };
    }
}

function toSignedFloat(sign, float) {
    if (sign.children.map(c => c.parse()) == '-') {
        return -1 * float.parse();
    } else {
        return float.parse();
    }
}

// Should be 18446744073709551615 but JavaScript doesn't go that high
const ULLONG_MAX = 18446744073709552000;

const ALLOWED_EMPTY_COMMANDS = ['examine', 'sign'];

function rgb(red, green, blue) {
    // Clamp values just in case
    return {
        r: Math.max(0, Math.min(red,   255)),
        g: Math.max(0, Math.min(green, 255)),
        b: Math.max(0, Math.min(blue,  255)),
    };
}

export const AW_PRESET_COLORS = {
    aquamarine:  rgb(112, 219, 147),
    black:       rgb(  0,   0,   0),
    blue:        rgb(  0,   0, 255),
    brass:       rgb(181, 166,  66),
    bronze:      rgb(140, 120,  83),
    brown:       rgb(166,  42,  42),
    copper:      rgb(184, 115,  51),
    cyan:        rgb(  0, 255, 255),
    darkgrey:    rgb( 48,  48,  48),
    forestgreen: rgb( 35, 142,  35),
    gold:        rgb(205, 127,  50),
    green:       rgb(  0, 255,   0),
    grey:        rgb(112, 112, 112),
    lightgrey:   rgb(192, 192, 192),
    magenta:     rgb(255,   0, 255),
    maroon:      rgb(142,  35, 107),
    navyblue:    rgb( 35,  35, 142),
    orange:      rgb(255, 127,   0),
    orangered:   rgb(255,  36,   0),
    orchid:      rgb(219, 112, 219),
    pink:        rgb(255, 110, 199),
    red:         rgb(255,   0,   0),
    salmon:      rgb(111,  66,  66),
    scarlet:     rgb(140,  23,  23),
    silver:      rgb(230, 232, 250),
    skyblue:     rgb( 50, 153, 204),
    tan:         rgb(219, 147, 112),
    teal:        rgb(  0, 112, 112),
    turquoise:   rgb(173, 234, 234),
    violet:      rgb( 79,  47,  79),
    white:       rgb(255, 255, 255),
    yellow:      rgb(255, 255,   0),
};

export const WEB_PRESET_COLORS = {
    aliceblue: rgb(240, 248, 255),
    antiquewhite: rgb(250, 235, 215),
    aqua: rgb(0, 255, 255),
    aquamarine: rgb(127, 255, 212),
    azure: rgb(240, 255, 255),
    beige: rgb(245, 245, 220),
    bisque: rgb(255, 228, 196),
    black: rgb(0, 0, 0),
    blanchedalmond: rgb(255, 235, 205),
    blue: rgb(0, 0, 255),
    blueviolet: rgb(138, 43, 226),
    brown: rgb(165, 42, 42),
    burlywood: rgb(222, 184, 135),
    cadetblue: rgb(95, 158, 160),
    chartreuse: rgb(127, 255, 0),
    chocolate: rgb(210, 105, 30),
    coral: rgb(255, 127, 80),
    cornflowerblue: rgb(100, 149, 237),
    cornsilk: rgb(255, 248, 220),
    crimson: rgb(220, 20, 60),
    cyan: rgb(0, 255, 255),
    darkblue: rgb(0, 0, 139),
    darkcyan: rgb(0, 139, 139),
    darkgoldenrod: rgb(184, 134, 11),
    darkgray: rgb(169, 169, 169),
    darkgreen: rgb(0, 100, 0),
    darkgrey: rgb(169, 169, 169),
    darkkhaki: rgb(189, 183, 107),
    darkmagenta: rgb(139, 0, 139),
    darkolivegreen: rgb(85, 107, 47),
    darkorange: rgb(255, 140, 0),
    darkorchid: rgb(153, 50, 204),
    darkred: rgb(139, 0, 0),
    darksalmon: rgb(233, 150, 122),
    darkseagreen: rgb(143, 188, 143),
    darkslateblue: rgb(72, 61, 139),
    darkslategray: rgb(47, 79, 79),
    darkslategrey: rgb(47, 79, 79),
    darkturquoise: rgb(0, 206, 209),
    darkviolet: rgb(148, 0, 211),
    deeppink: rgb(255, 20, 147),
    deepskyblue: rgb(0, 191, 255),
    dimgray: rgb(105, 105, 105),
    dimgrey: rgb(105, 105, 105),
    dodgerblue: rgb(30, 144, 255),
    firebrick: rgb(178, 34, 34),
    floralwhite: rgb(255, 250, 240),
    forestgreen: rgb(34, 139, 34),
    fuchsia: rgb(255, 0, 255),
    gainsboro: rgb(220, 220, 220),
    ghostwhite: rgb(248, 248, 255),
    gold: rgb(255, 215, 0),
    goldenrod: rgb(218, 165, 32),
    gray: rgb(128, 128, 128),
    green: rgb(0, 128, 0),
    greenyellow: rgb(173, 255, 47),
    grey: rgb(128, 128, 128),
    honeydew: rgb(240, 255, 240),
    hotpink: rgb(255, 105, 180),
    indianred: rgb(205, 92, 92),
    indigo: rgb(75, 0, 130),
    ivory: rgb(255, 255, 240),
    khaki: rgb(240, 230, 140),
    lavender: rgb(230, 230, 250),
    lavenderblush: rgb(255, 240, 245),
    lawngreen: rgb(124, 252, 0),
    lemonchiffon: rgb(255, 250, 205),
    lightblue: rgb(173, 216, 230),
    lightcoral: rgb(240, 128, 128),
    lightcyan: rgb(224, 255, 255),
    lightgoldenrodyellow: rgb(250, 250, 210),
    lightgray: rgb(211, 211, 211),
    lightgreen: rgb(144, 238, 144),
    lightgrey: rgb(211, 211, 211),
    lightpink: rgb(255, 182, 193),
    lightsalmon: rgb(255, 160, 122),
    lightseagreen: rgb(32, 178, 170),
    lightskyblue: rgb(135, 206, 250),
    lightslategray: rgb(119, 136, 153),
    lightslategrey: rgb(119, 136, 153),
    lightsteelblue: rgb(176, 196, 222),
    lightyellow: rgb(255, 255, 224),
    lime: rgb(0, 255, 0),
    limegreen: rgb(50, 205, 50),
    linen: rgb(250, 240, 230),
    magenta: rgb(255, 0, 255),
    maroon: rgb(128, 0, 0),
    mediumaquamarine: rgb(102, 205, 170),
    mediumblue: rgb(0, 0, 205),
    mediumorchid: rgb(186, 85, 211),
    mediumpurple: rgb(147, 112, 219),
    mediumseagreen: rgb(60, 179, 113),
    mediumslateblue: rgb(123, 104, 238),
    mediumspringgreen: rgb(0, 250, 154),
    mediumturquoise: rgb(72, 209, 204),
    mediumvioletred: rgb(199, 21, 133),
    midnightblue: rgb(25, 25, 112),
    mintcream: rgb(245, 255, 250),
    mistyrose: rgb(255, 228, 225),
    moccasin: rgb(255, 228, 181),
    navajowhite: rgb(255, 222, 173),
    navy: rgb(0, 0, 128),
    oldlace: rgb(253, 245, 230),
    olive: rgb(128, 128, 0),
    olivedrab: rgb(107, 142, 35),
    orange: rgb(255, 165, 0),
    orangered: rgb(255, 69, 0),
    orchid: rgb(218, 112, 214),
    palegoldenrod: rgb(238, 232, 170),
    palegreen: rgb(152, 251, 152),
    paleturquoise: rgb(175, 238, 238),
    palevioletred: rgb(219, 112, 147),
    papayawhip: rgb(255, 239, 213),
    peachpuff: rgb(255, 218, 185),
    peru: rgb(205, 133, 63),
    pink: rgb(255, 192, 203),
    plum: rgb(221, 160, 221),
    powderblue: rgb(176, 224, 230),
    purple: rgb(128, 0, 128),
    rebeccapurple: rgb(102, 51, 153),
    red: rgb(255, 0, 0),
    rosybrown: rgb(188, 143, 143),
    royalblue: rgb(65, 105, 225),
    saddlebrown: rgb(139, 69, 19),
    salmon: rgb(250, 128, 114),
    sandybrown: rgb(244, 164, 96),
    seagreen: rgb(46, 139, 87),
    seashell: rgb(255, 245, 238),
    sienna: rgb(160, 82, 45),
    silver: rgb(192, 192, 192),
    skyblue: rgb(135, 206, 235),
    slateblue: rgb(106, 90, 205),
    slategray: rgb(112, 128, 144),
    slategrey: rgb(112, 128, 144),
    snow: rgb(255, 250, 250),
    springgreen: rgb(0, 255, 127),
    steelblue: rgb(70, 130, 180),
    tan: rgb(210, 180, 140),
    teal: rgb(0, 128, 128),
    thistle: rgb(216, 191, 216),
    tomato: rgb(255, 99, 71),
    turquoise: rgb(64, 224, 208),
    violet: rgb(238, 130, 238),
    wheat: rgb(245, 222, 179),
    white: rgb(255, 255, 255),
    whitesmoke: rgb(245, 245, 245),
    yellow: rgb(255, 255, 0),
    yellowgreen: rgb(154, 205, 50),
};

function forceStringToRGB(str) {
    if (!str) return null;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return { r: (hash & 0xFF0000) >> 16, g: (hash & 0x00FF00) >> 8, b: hash & 0x0000FF };
}

function colorStringToRGB(colorString) {
    // Convert color string to lowercase for case-insensitivity
    colorString = colorString.toLowerCase();

    // Check if it's a preset color
    const presetColors = AW_PRESET_COLORS;

    if (colorString in presetColors) {
        return presetColors[colorString];
    }


    // Check for hexadecimal color string
    const extractedHex = colorString.match(/(^[a-f0-9]+)/);
    if (extractedHex) {
        // Get first hexadecimal string match & convert to number
        const colorValue = parseInt(extractedHex[0], 16);

        // Handle overflow case
        if (colorValue > ULLONG_MAX) {
            // AW considers everything white at this point
            return rgb(255, 255, 255); // Assuming rgb is defined elsewhere
        } else {
            // Extract RGB values
            const red = (colorValue >> 16) % 256;
            const green = (colorValue >> 8) % 256;
            const blue = (colorValue >> 0) % 256;

            // Ensure RGB values are within the valid range
            return rgb(
                red < 0 ? red + 256 : red,
                green < 0 ? green + 256 : green,
                blue < 0 ? blue + 256 : blue,
            );
        }
    }

    // Fallback to stringToHexColor if the color is not recognized
    return forceStringToRGB(colorString);
}

// TODO: Investigate allowing duplicate commands
//  (useful for applying to multiple tags)
function mergeActions(actions) {
    let simplifiedData = {};
    for (let action of actions) {
        // needed so triggers are case-insensitive
        action.trigger = action.trigger.toLowerCase();

        if (action.trigger && !(action.trigger in simplifiedData)) {
            // Only the first action should be kept
            const mergedCommands = mergeCommands(action.commands);
            if (mergedCommands.length > 0) {
                // Only add action if there are commands inside
                simplifiedData[action.trigger] = mergedCommands;
            }
        }
    }
    return simplifiedData;
}

function mergeCommands(commands) {
    let mergedCommands = new Map();
    for (const command of commands) {
        if (command === null) {
            // Remove invalid commands (usually due to duplicated parameters)
            continue;
        }
        // needed so commands are case-insensitive
        command.commandType = command.commandType.toLowerCase();
        if (!ALLOWED_EMPTY_COMMANDS.includes(command.commandType) && Object.keys(command).length == 1) {
            // Remove commands without parameters
            continue;
        }
        if (command.commandType == 'name') {
            // Keep last name command only
            mergedCommands.set(command.commandType, command);
        } else {
            // Only keep 1 per targetName (including no targetName)
            const commandKey = command.commandType + ('targetName' in command ? command.targetName : '');
            mergedCommands.set(commandKey, command);
        }
    }
    return Array.from(mergedCommands.values());
}

class AWActionParser {

    constructor() {
        this.grammar = ohm.grammar(GRAMMAR_DEFINITION);
        this.semantics = this.grammar.createSemantics();
        this.semantics.addOperation('parse', {
            Actions(actions, _) { // eslint-disable-line no-unused-vars
                return actions.asIteration().children.map(c => c.parse());
            },
            Action(trigger, commands, _) { // eslint-disable-line no-unused-vars
                return {
                    trigger: trigger.parse(),
                    commands: commands.asIteration().children.map(c => c.parse()),
                };
            },
            MultiArgumentCommand(commandName, commandArguments) {
                return resolveCommand(commandName.children.map(c => c.parse())[0], commandArguments);
            },
            positiveInteger(input) {
                return parseInt(input.children.map(c => c.parse()).join(''));
            },
            float_fract(integral, _, fractional) {
                return parseFloat([].concat(integral.children.map(c => c.parse()), ['.'], fractional.children.map(c => c.parse())).join(''));
            },
            float_whole(number) {
                return parseFloat(number.children.map(c => c.parse()).join(''));
            },
            float(floatType) {
                return floatType.parse();
            },
            animateTextureName(input) {
                return ['texture', input.parse()];
            },
            basicResourceTarget(input) {
                return input.children.map(c => c.parse()).join('');
            },
            resourceTarget(input) {
                return ['resource', input.children.map(c => c.parse()).join('')];
            },
            maskName(input) {
                return input.children
                    .map(c => c.children.map(d => d.parse()).join(''))
                    .join('');
            },
            objectName(name) {
                return name.children.map(c => c.children.map(d => d.parse()).join('')).join('');
            },
            nameArgument(name) {
                return ['targetName', name.children.map(c => c.children.map(d => d.parse()).join('')).join('').toLowerCase()];
            },
            namedParameter(parameterName, _, value) {
                return [parameterName.parse().toLowerCase(), value.parse()];
            },
            namedURLParameter(parameterName, _, value) {
                return [parameterName.parse(), value.sourceString];
            },
            nameParameter(name) {
                return ['targetName', name.parse()[1].toLowerCase()];
            },
            boolean(boolean) {
                const bool = boolean.parse().toLowerCase();
                if (bool == 'on' || bool == 'true' || bool == 'yes') {
                    return true;
                } else if (bool == 'off' || bool == 'false' || bool == 'no') {
                    return false;
                } else {
                    return undefined;
                }
            },
            booleanArgument(boolean) {
                return ['value', boolean.parse()];
            },
            colorName(color) {
                return colorStringToRGB(color.children.map(c => c.children.map(d => d.parse()).join('')).join(''));
            },
            colorArgument(color) {
                if (color.parse()) {
                    return ['color', color.parse()];
                }
            },
            tintArgument(tint) {
                return ['tint', tint.parse().toLowerCase() === 'tint'];
            },
            fxType(fx) {
                return fx.parse().toLowerCase();
            },
            ExamineCommand(_) { // eslint-disable-line no-unused-vars
                return {commandType: 'examine'};
            },
            opacityValue(value) {
                // Values below 0.0 will get clamped to 0.0,
                // Values above 1.0 will get clamped to 1.0.
                const opacity = value.parse();
                return ['value', clamp(opacity, 0.0, 1.0)];
            },
            intensityValue(value) {
                // Values below 0.0 will get clamped to 0.0,
                // Values above 1.0 will get clamped to 1.0.
                const intensity = value.parse();
                return ['intensity', clamp(intensity, 0.0, 1.0)];
            },
            RotateDistances(coordinates) {
                return ['speed', resolveIncompleteCoordinates(coordinates.children.map(c => c.parse()))];
            },
            MoveDistances(coordinates) {
                return ['distance', resolveIncompleteCoordinates(coordinates.children.map(c => c.parse()))];
            },
            ScaleFactor(coordinates) {
                return ['factor', resolveIncompleteScaleCoordinates(coordinates.children.map(c => c.parse()))];
            },
            ShearFactor(factors) {
                const values = factors.children.map(c => {
                    const v = parseFloat(c.parse());
                    return isNaN(v) ? 0 : Math.max(-5.0, Math.min(5.0, v));
                });

                const [x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0] = values;

                return ['axes', { x1, y1, z1, x2, y2, z2 }];
            },
            WarpCommand(commandName, coordinates) {
                const wCoords = coordinates.parse();
                return {
                    commandType: 'warp',
                    coordinates: wCoords.coordinates,
                    altitude: wCoords.altitude,
                    direction: wCoords.direction,
                };
            },
            WorldCoordinates(coordinates, altitude, direction) {
                return {
                    coordinates: coordinates.parse(),
                    altitude: altitude.children.map(c => c.parse())[0],
                    direction: direction ? direction.children.map(c => c.parse())[0] : null,
                };
            },
            RelativeCoordinates(x, y) {
                return {
                    coordinateType: 'relative',
                    x: x.parse(),
                    y: y.parse(),
                };
            },
            AbsoluteCoordinates(x, y) {
                return {
                    coordinateType: 'absolute',
                    NS: x.parse(),
                    EW: y.parse(),
                };
            },
            nsCoordinate(float, axis) {
                const axisLetter = axis.parse();
                if (axisLetter == 'N') {
                    return float.parse();
                } else {
                    return -1 * float.parse();
                }
            },
            ewCoordinate(float, axis) {
                const axisLetter = axis.parse();
                if (axisLetter == 'E') {
                    return float.parse();
                } else {
                    return -1 * float.parse();
                }
            },
            //, imagecount = 1, framecount = 1,
            //framedelay = 0,
            //framelist = []
            // tagParameter? maskStatus? nameArgument animateTextureName
            //  tagParameter | maskStatus | nameArgument | animateTextureName
            AnimateCommand(commandName, tag = 'none', maskStatus = 'nomask',
                name, animateTextureName,
            ) {
                let command = {
                    commandType: 'animate',
                };
                command.tag = tag;
                command.maskStatus = maskStatus;
                command.targetName = name;
                command.texture = animateTextureName;
                return command;
            },
            TeleportCommand(commandName, worldName, worldCoordinates) {
                let command = {
                    commandType: 'teleport',
                };
                const world = worldName.children.map(c => c.parse());
                if (world.length > 0) {
                    command.worldName = world[0];
                }
                const coordinates = worldCoordinates.children.map(c => c.parse());
                if (coordinates.length > 0) {
                    command.coordinates = coordinates[0];
                }
                return command;
            },
            worldName(name) {
                return name.children.map(c => c.parse()).join('');
            },
            signedFloat(sign, float) {
                return toSignedFloat(sign, float);
            },
            forceSignedFloat(sign, float) {
                return toSignedFloat(sign, float);
            },
            altitude(sign, float, _) { // eslint-disable-line no-unused-vars
                if (sign.children.map(c => c.parse()).length > 0) {
                    return {
                        altitudeType: 'relative',
                        value: toSignedFloat(sign, float),
                    };
                } else {
                    return {
                        altitudeType: 'absolute',
                        value: toSignedFloat(sign, float),
                    };
                }
            },
            syncStatus(status) {
                if (status.parse() == 'sync') {
                    return ['sync', true];
                } else {
                    return ['sync', false];
                }
            },
            loopStatus(status) {
                if (status.parse() == 'loop') {
                    return ['loop', true];
                } else {
                    return ['loop', false];
                }
            },
            resetStatus(status) {
                if (status.parse() == 'reset') {
                    return ['reset', true];
                } else {
                    return ['reset', false];
                }
            },
            sayText(text) {
                return ['text', text.parse()];
            },
            sayQuotedText(_, text, __) { // eslint-disable-line no-unused-vars
                return text.children.map(c => c.parse()).join('');
            },
            sayUnquotedText(text) {
                return text.children.map(c => c.parse()).join('');
            },
            seqName(input) {
                return ['seq', input.parse()];
            },
            signText(text) {
                return ['text', text.parse()];
            },
            signQuotedText(_, text, __) { // eslint-disable-line no-unused-vars
                return text.children.map(c => c.parse()).join('');
            },
            signUnquotedText(text) {
                return text.children.map(c => c.parse()).join('');
            },
            invalidCommand(command) {
                return {commandType: 'invalid', commandText: command.children.map(c => c.parse()).join('')};
            },
            _terminal() {
                return this.sourceString;
            },
        });
    }
    // Return parsed action string
    parse(actionString) {
        const match = this.grammar.match(cleanActionString(actionString));

        if (match.succeeded()) {
            return mergeActions(this.semantics(match).parse());
        }
        return {};
    }

    // Return a message explaining the possible parsing failure
    debug(actionString) {
        const match = this.grammar.match(cleanActionString(actionString));
        if (match.failed()) {
            return match.message;
        }
        return '';
    }

}

export { AWActionParser };
