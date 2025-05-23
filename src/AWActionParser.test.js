import { AWActionParser } from './AWActionParser';

const parser = new AWActionParser();

test('texture url', () => {
    //mask=https://nekohime.net/images/3d/filmstrips/film1.jpg'
    expect(parser.parse('create texture rail1 mask=https://nekohime.net/images/3d/filmstrips/film1.jpg')).toStrictEqual({
        create: [
            {
                commandType: 'texture',
                resource: 'rail1',
                mask: 'https://nekohime.net/images/3d/filmstrips/film1.jpg',

            },
        ],
    });
});

test('empty string', () => {
    expect(parser.parse('')).toStrictEqual({});
});

test('invalid string', () => {
    expect(parser.parse('foobar')).toStrictEqual({});
});

test('invalid string has debug information', () => {
    expect(parser.debug('foobar').length).toBeGreaterThan(0);
});

test('good string has empty debug information', () => {
    expect(parser.debug('create color green;').length).toBe(0);
});

test('create color green', () => {
    expect(parser.parse('create color green')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 255, b: 0},
            },
        ],
    });
});

// color with tint

test('create color tint red', () => {
    expect(parser.parse('create color TINT red')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 255, g: 0, b: 0},
                tint: true,
            },
        ],
    });
});

test('create color red tint', () => {
    expect(parser.parse('create color red tint')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 255, g: 0, b: 0},
                tint: true,
            },
        ],
    });
});

test('whitespace and semicolons do not matter', () => {
    expect(parser.parse('create   color        abcdef;;;;;;')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 171, g: 205, b: 239},
            },
        ],
    });
});

test('multiple color applies last only', () => {
    expect(parser.parse('create color green, color red, color blue')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 0, b: 255},
            },
        ],
    });
});

test('multiple names applies last only', () => {
    expect(parser.parse('create name foo, name bar, name baz')).toStrictEqual({
        create: [
            {
                commandType: 'name',
                targetName: 'baz',
            },
        ],
    });
});

test('multiple create applies first only', () => {
    expect(parser.parse('create color green; create color red')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 255, b: 0},
            },
        ],
    });
});

test('rotate with 1 number is about Y', () => {
    expect(parser.parse('create rotate 1')).toStrictEqual({
        create: [
            {
                commandType: 'rotate',
                speed: {
                    x: 0,
                    y: 1,
                    z: 0,
                },
            },
        ],
    });
});

test('rotate with 2 numbers is about X and Y', () => {
    expect(parser.parse('create rotate 1 2')).toStrictEqual({
        create: [
            {
                commandType: 'rotate',
                speed: {
                    x: 1,
                    y: 2,
                    z: 0,
                },
            },
        ],
    });
});

test('rotate with 3 numbers is about X, Y and Z', () => {
    expect(parser.parse('create rotate 1 2 3')).toStrictEqual({
        create: [
            {
                commandType: 'rotate',
                speed: {
                    x: 1,
                    y: 2,
                    z: 3,
                },
            },
        ],
    });
});

test('rotate can handle funny floats', () => {
    expect(parser.parse('create rotate -.234 234.903 -12.093')).toStrictEqual({
        create: [
            {
                commandType: 'rotate',
                speed: {
                    x: -0.234,
                    y: 234.903,
                    z: -12.093,
                },
            },
        ],
    });
});

test('move with 1 number is about Y', () => {
    expect(parser.parse('create move 1')).toStrictEqual({
        create: [
            {
                commandType: 'move',
                distance: {
                    x: 0,
                    y: 1,
                    z: 0,
                },
            },
        ],
    });
});

test('move with 2 numbers is about X and Y', () => {
    expect(parser.parse('create move 1 2')).toStrictEqual({
        create: [
            {
                commandType: 'move',
                distance: {
                    x: 1,
                    y: 2,
                    z: 0,
                },
            },
        ],
    });
});

test('move with 3 numbers is about X, Y and Z', () => {
    expect(parser.parse('create move 1 2 3')).toStrictEqual({
        create: [
            {
                commandType: 'move',
                distance: {
                    x: 1,
                    y: 2,
                    z: 3,
                },
            },
        ],
    });
});

test('empty command does not return anything', () => {
    expect(parser.parse('create rotate')).toStrictEqual({});
});

test('examine command returns properly', () => {
    expect(parser.parse('create examine')).toStrictEqual({
        create: [
            {
                commandType: 'examine',
            },
        ],
    });
});

test('multiple color with different names applies all', () => {
    expect(parser.parse('create color green, color red name=foo, color blue name=bar')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 255, b: 0},
            },
            {
                commandType: 'color',
                color: {r: 255, g: 0, b: 0},
                targetName: 'foo',
            },
            {
                commandType: 'color',
                color: {r: 0, g: 0, b: 255},
                targetName: 'bar',
            },
        ],
    });
});

// Solid booleans
test('create solid off', () => {
    expect(parser.parse('create solid off')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: false,
            },
        ],
    });
});

test('create solid false', () => {
    expect(parser.parse('create solid false')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: false,
            },
        ],
    });
});

test('create solid no', () => {
    expect(parser.parse('create solid no')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: false,
            },
        ],
    });
});

test('create solid on', () => {
    expect(parser.parse('create solid on')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: true,
            },
        ],
    });
});

test('create solid true', () => {
    expect(parser.parse('create solid true')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: true,
            },
        ],
    });
});

test('create solid yes', () => {
    expect(parser.parse('create solid yes')).toStrictEqual({
        create: [
            {
                commandType: 'solid',
                value: true,
            },
        ],
    });
});

// Visible booleans
test('create visible off', () => {
    expect(parser.parse('create visible off')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: false,
            },
        ],
    });
});

test('create visible named off', () => {
    expect(parser.parse('create visible named off')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: false,
                targetName: 'named',
            },
        ],
    });
});

test('create visible false', () => {
    expect(parser.parse('create visible false')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: false,
            },
        ],
    });
});

test('create visible no', () => {
    expect(parser.parse('create visible no')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: false,
            },
        ],
    });
});

test('create visible on', () => {
    expect(parser.parse('create visible on')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: true,
            },
        ],
    });
});

test('create visible true', () => {
    expect(parser.parse('create visible true')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: true,
            },
        ],
    });
});

test('create visible yes', () => {
    expect(parser.parse('create visible yes')).toStrictEqual({
        create: [
            {
                commandType: 'visible',
                value: true,
            },
        ],
    });
});

// Colors
test('empty create color', () => {
    expect(parser.parse('create color')).toStrictEqual({});
});

test('create color f', () => {
    expect(parser.parse('create color f')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 0, b: 15},
            },
        ],
    });
});

test('create color ff', () => {
    expect(parser.parse('create color ff')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 0, b: 255},
            },
        ],
    });
});

test('create color fff', () => {
    expect(parser.parse('create color fff')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 15, b: 255},
            },
        ],
    });
});

test('create long color', () => {
    expect(parser.parse('create color foobarbazaaaaaaaaaaaaaaaaaa')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 0, b: 15},
            },
        ],
    });
});

test('invalid color gets coerced into a color anyway', () => {
    expect(parser.parse('create color poorchoice')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 211, g: 212, b:67},
            },
        ],
    });
});

test('no color results in no action', () => {
    expect(parser.parse('create color')).toStrictEqual({});
});

test('create texture with mask', () => {
    expect(parser.parse('create texture fleurs19 mask=fleurs19m')).toStrictEqual({
        create: [
            {
                commandType: 'texture',
                resource: 'fleurs19',
                mask: 'fleurs19m',
            },
        ],
    });
});

test('create texture with mask and tag', () => {
    expect(parser.parse('create texture fleurs19 mask=fleurs19m tag=3')).toStrictEqual({
        create: [
            {
                commandType: 'texture',
                resource: 'fleurs19',
                mask: 'fleurs19m',
                tag: 3,
            },
        ],
    });
});

/*
WIP
test('create animate me stone3', () => {
    expect(parser.parse('create animate me stone3')).toStrictEqual({
        create: [
            {
                commandType: 'animate',
                targetName: 'me',
                texture: 'stone3',
                maskStatus: 'nomask',
                tag: "none",
            },
        ],
    });
});
*/

test('create rotate & move with reset', () => {
    expect(parser.parse('create rotate 0 0 0 reset, move 0 0 2 loop reset time=5 wait=1')).toStrictEqual({
        create: [
            {
                commandType: 'rotate',
                speed: {x: 0, y: 0, z: 0},
                reset: true,
            },
            {
                commandType: 'move',
                distance: {x: 0, y: 0, z: 2},
                loop: true,
                reset: true,
                time: 5,
                wait: 1,
            },
        ],
    });
});

test('empty create sign returns properly', () => {
    expect(parser.parse('create sign')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
            },
        ],
    });
});

test('create sign with args', () => {
    expect(parser.parse('create sign color=yellow bcolor=pink')).toStrictEqual({
        create: [
            {
                color: {b: 0, g: 255, r: 255},
                bcolor: {b: 199, g: 110, r: 255},
                commandType: 'sign',
            },
        ],
    });
});

test('create opacity 1.0 == 1.0', () => {
    expect(parser.parse('create opacity 1.0')).toStrictEqual({
        create: [
            {
                commandType: 'opacity',
                value: 1.0,
            },
        ],
    });
});

test('create opacity -0.5 == 0.0', () => {
    expect(parser.parse('create opacity -0.05')).toStrictEqual({
        create: [
            {
                commandType: 'opacity',
                value: 0.0,
            },
        ],
    });
});

test('create opacity 2.5 == 1.0', () => {
    expect(parser.parse('create opacity 2.5')).toStrictEqual({
        create: [
            {
                commandType: 'opacity',
                value: 1.0,
            },
        ],
    });
});

test('create opacity on target name', () => {
    expect(parser.parse('create opacity 1.0 name=wowsuchinvisible')).toStrictEqual({
        create: [
            {
                commandType: 'opacity',
                value: 1.0,
                targetName: 'wowsuchinvisible',
            },
        ],
    });
});

test('create opacity on target name with tag', () => {
    expect(parser.parse('create opacity 1.0 name=wowsuchinvisible tag=100')).toStrictEqual({
        create: [
            {
                commandType: 'opacity',
                value: 1.0,
                targetName: 'wowsuchinvisible',
                tag: 100,
            },
        ],
    });
});

//

test('create ambient on target name with tag', () => {
    expect(parser.parse('create ambient 1.0 name=wowsuchambient tag=100')).toStrictEqual({
        create: [
            {
                commandType: 'ambient',
                intensity: 1.0,
                targetName: 'wowsuchambient',
                tag: 100,
            },
        ],
    });
});

test('create diffuse on target name with tag', () => {
    expect(parser.parse('create diffuse 1.0 name=wowsuchdiffusion tag=100')).toStrictEqual({
        create: [
            {
                commandType: 'diffuse',
                intensity: 1.0,
                targetName: 'wowsuchdiffusion',
                tag: 100,
            },
        ],
    });
});

test('create specular on target name with tag and shininess', () => {
    expect(parser.parse('create specular name=wowsuchspecularity tag=100 1')).toStrictEqual({
        create: [
            {
                commandType: 'specular',
                intensity: 1.0,
                targetName: 'wowsuchspecularity',
                tag: 100,
            },
        ],
    });
});

// picture with url
test('create picture http://www.example.com/sample.jpg', () => {
    expect(parser.parse('create picture http://www.example.com/sample.jpg')).toStrictEqual({
        create: [
            {
                commandType: 'picture',
                resource: 'http://www.example.com/sample.jpg',
            },
        ],
    });
});

// picture with filename
test('create picture sample.jpg', () => {
    expect(parser.parse('create picture sample.jpg')).toStrictEqual({
        create: [
            {
                commandType: 'picture',
                resource: 'sample.jpg',
            },
        ],
    });
});

test('scale with 1 number scales in all 3 axes', () => {
    expect(parser.parse('create scale 2')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 2,
                    y: 2,
                    z: 2,
                },
            },
        ],
    });
});

test('scale with 2 numbers scales X and Y, with Z staying to a default of 0', () => {
    expect(parser.parse('create scale 2 2')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 2,
                    y: 2,
                    z: 1,
                },
            },
        ],
    });
});

test('scale with 3 numbers scales X, Y and Z separately', () => {
    expect(parser.parse('create scale 3 4 5')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 3,
                    y: 4,
                    z: 5,
                },
            },
        ],
    });
});

test('scale with 1 number at a negative value defaults it to 0.2', () => {
    expect(parser.parse('create scale -2')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                },
            },
        ],
    });
});

test('scale with 2 numbers at a negative value defaults them to 0.2', () => {
    expect(parser.parse('create scale -2 -3')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 0.1,
                    y: 0.1,
                    z: 1,
                },
            },
        ],
    });
});

test('scale with 3 numbers, first and last negative but second positive = 1, n, 1', () => {
    expect(parser.parse('create scale -2 3 -4')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 0.1,
                    y: 3,
                    z: 0.1,
                },
            },
        ],
    });
});

test('scale with four values should only process the first three', () => {
    expect(parser.parse('create scale -3 4 -8 1300')).toStrictEqual({
        create: [
            {
                commandType: 'scale',
                factor: {
                    x: 0.1,
                    y: 4,
                    z: 0.1,
                },
            },
        ],
    });
});

test('sign text with quotes', () => {
    expect(parser.parse('create sign "i am the sign text"')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: 'i am the sign text',
            },
        ],
    });
});

test('sign text with quotes, trigger and command case-insensitive but not the string', () => {
    expect(parser.parse('create sign "I AM THE SENATE"')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: 'I AM THE SENATE',
            },
        ],
    });
});

test('sign text without quotes', () => {
    expect(parser.parse('create sign i_am_the_sign_text')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: 'i_am_the_sign_text',
            },
        ],
    });
});

test('sign text with unquoted unicode', () => {
    expect(parser.parse('create sign 🙃')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: '🙃',
            },
        ],
    });
});

test('sign text with quoted unicode', () => {
    expect(parser.parse('create sign "こんにちは!"')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: 'こんにちは!',
            },
        ],
    });
});

test('sign text with quoted unicode and other things after', () => {
    expect(parser.parse('create sign "こんにちは!"; activate sign 🙃')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: 'こんにちは!',
            },
        ],
        activate: [
            {
                commandType: 'sign',
                text: '🙃',
            },
        ],
    });
});

test('sign text with only one quote', () => {
    expect(parser.parse('create sign "; activate something')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                text: '; activate something',
            },
        ],
    });
});

test('invalid sign text without quotes', () => {
    expect(parser.parse('create sign i am the sign text, light brightness=1')).toStrictEqual({
        create: [
            {
                commandType: 'light',
                brightness: 1,
            },
        ],
    });
});

test('complex example', () => {
    expect(parser.parse('create sign bcolor=white color=black;activate sign Rickrolled bcolor=white color=black, media http://127.0.0.1/music/spam/rickroll/Never_gonna_give_you_up.mp3 name=Mplayer radius=1000')).toStrictEqual({
        create: [
            {
                commandType: 'sign',
                bcolor: {
                    r: 255,
                    g: 255,
                    b: 255,
                },
                color: {
                    r: 0,
                    g: 0,
                    b: 0,
                },
            },
        ],
        activate: [
            {
                commandType: 'sign',
                text: 'Rickrolled',
                bcolor: {
                    r: 255,
                    g: 255,
                    b: 255,
                },
                color: {
                    r: 0,
                    g: 0,
                    b: 0,
                },
            },
            {
                commandType: 'media',
                radius: 1000,
                resource: 'http://127.0.0.1/music/spam/rickroll/Never_gonna_give_you_up.mp3',
                targetName: 'mplayer',
            },
        ],
    });
});


// Say Command

test('say text with quotes', () => {
    expect(parser.parse('create say "i am the say text"')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: 'i am the say text',
            },
        ],
    });
});

test('say text without quotes', () => {
    expect(parser.parse('create say i_am_the_say_text')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: 'i_am_the_say_text',
            },
        ],
    });
});

test('say text with unquoted unicode', () => {
    expect(parser.parse('create say 🙃')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: '🙃',
            },
        ],
    });
});

test('say text with quoted unicode', () => {
    expect(parser.parse('create say "こんにちは!"')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: 'こんにちは!',
            },
        ],
    });
});

test('say text with quoted unicode and other things after', () => {
    expect(parser.parse('create say "こんにちは!"; activate say 🙃')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: 'こんにちは!',
            },
        ],
        activate: [
            {
                commandType: 'say',
                text: '🙃',
            },
        ],
    });
});

test('say text with only one quote', () => {
    expect(parser.parse('create say "; activate something')).toStrictEqual({
        create: [
            {
                commandType: 'say',
                text: '; activate something',
            },
        ],
    });
});

test('invalid say text without quotes', () => {
    expect(parser.parse('create say i am the say text, light brightness=1')).toStrictEqual({
        create: [
            {
                commandType: 'light',
                brightness: 1,
            },
        ],
    });
});


test('create light color=green', () => {
    expect(parser.parse('create light color=green')).toStrictEqual({
        create: [
            {
                commandType: 'light',
                color: {
                    'r': 0,
                    'g': 255,
                    'b': 0,
                },
            },

        ],
    });
});

test('create color with create light color=', () => {
    expect(parser.parse('create color blue, light color=red')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {
                    'r': 0,
                    'g': 0,
                    'b': 255,
                },
            },
            {
                commandType: 'light',
                color: {
                    'r': 255,
                    'g': 0,
                    'b': 0,
                },
            },
        ],
    });
});


test('picture with update', () => {
    expect(parser.parse('create picture example.jpg update=500')).toStrictEqual({
        create: [
            {
                commandType: 'picture',
                resource: 'example.jpg',
                update: 500,
            },
        ],
    });
});

test.each(['français', 'a.b.c.', 'Mars123'])('simple world name check (%p)', (testWorldName) => {
    expect(parser.parse(`bump teleport ${testWorldName}`)).toStrictEqual({
        bump: [
            {
                commandType: 'teleport',
                worldName: testWorldName,
            },
        ],
    });
});

test('world name cannot start with a digit', () => {
    expect(parser.parse('bump teleport 1abcd')).toStrictEqual({});
});

test('(case insensitivity) cREAtE COLOr green', () => {
    expect(parser.parse('cREAtE COLOr green')).toStrictEqual({
        create: [
            {
                commandType: 'color',
                color: {r: 0, g: 255, b: 0},
            },
        ],
    });
});

test('(case insensitivity) CREAtE LIGHT COLOR=BLUE Fx=fire', () => {
    expect(parser.parse('CREAtE LIGHT COLOR=BLUE Fx=Fire')).toStrictEqual({
        create: [
            {
                commandType: 'light',
                color: {r: 0, g: 0, b: 255},
                fx: 'fire',
            },
        ],
    });
});

test('create seq qhappyf', () => {
    expect(parser.parse('create seq qhappyf')).toStrictEqual({
        create: [
            {
                commandType: 'seq',
                seq: 'qhappyf',
            },
        ],
    });
});

// Shear Tests

test('create shear 5', () => {
    expect(parser.parse('create shear 5')).toStrictEqual({
        create: [
            {
                commandType: 'shear',
                axes: {
                    x1: 5,
                    y1: 0,
                    z1: 0,
                    x2: 0,
                    y2: 0,
                    z2: 0,
                },
            },
        ],
    });
});

test('create shear 5 0 5', () => {
    expect(parser.parse('create shear 5 0 5')).toStrictEqual({
        create: [
            {
                commandType: 'shear',
                axes: {
                    x1: 5,
                    y1: 0,
                    z1: 5,
                    x2: 0,
                    y2: 0,
                    z2: 0,
                },
            },
        ],
    });
});

test('create shear 0 0 -5 1 .5 5', () => {
    expect(parser.parse('create shear 0 0 -5 1 .5 5')).toStrictEqual({
        create: [
            {
                commandType: 'shear',
                axes: {
                    x1: 0,
                    y1: 0,
                    z1: -5,
                    x2: 1,
                    y2: .5,
                    z2: 5,
                },
            },
        ],
    });
});

// Named shear
test('create shear 0 0 -5 1 .5 5 name=test', () => {
    expect(parser.parse('create shear 0 0 -5 1 .5 5 name=test')).toStrictEqual({
        create: [
            {
                commandType: 'shear',
                axes: {
                    x1: 0,
                    y1: 0,
                    z1: -5,
                    x2: 1,
                    y2: .5,
                    z2: 5,
                },
                targetName: 'test',
            },
        ],
    });
});

// We only care about the first 6 numbers
test('create shear 0 0 -5 1 .5 5 1337', () => {
    expect(parser.parse('create shear 0 0 -5 1 .5 5')).toStrictEqual({
        create: [
            {
                commandType: 'shear',
                axes: {
                    x1: 0,
                    y1: 0,
                    z1: -5,
                    x2: 1,
                    y2: .5,
                    z2: 5,
                },
            },
        ],
    });
});
