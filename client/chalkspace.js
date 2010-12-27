// Chalkspace client | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Chalkspace is a collaborative 3D drawing environment. 3D is achieved by creating a plane (one exists already by default) and drawing on it. It isn't designed to be customizable. Rather, it's
// designed to provide a minimal set of options required to make editing reasonably easy. This includes things like changing the drawing plane's position, flipping it into the other axis, and
// moving the viewport within a 2D plane. That's about it though.

// Model.
// The model just contains lines in 3D space. The user has an "active plane" that contains lines. It's designed so that every location on the screen maps to a UV-coordinate on the plane. The
// plane is a user-specific object; it isn't shared. The user has two options for transforming the plane. One is to translate it along its normal vector, and the other is to rotate it 90 degrees
// along the Y (vertical) axis.

//   Controls.
//   Shift-drag moves the viewport, the spacebar flips the plane, and the up/down arrows and the mousewheel move the plane along its normal vector. Dragging the mouse causes lines to be drawn.

  $(caterwaul.clone('std seq continuation montenegro vector')(function () {
    l*[b = $('body'), screen = html[canvas] /se[b.append(_)], rpc = caterwaul.montenegro.rpc /re[{listen: _('/listen'), draw: _('/draw')}]] in
    screen /se[b.resize(_) /cps.e[_.attr({width: b.width(), height: b.height()}), _.repaint()],

               _.context()     = _[0].getContext('2d'),
               _.clear()       = _.context() /se[_.fillStyle = '#222', _.globalAlpha = 1.0, _.fillRect(0, 0, _.width, _.height)],
               _.line(v1, v2)  = _.context() /se[_.strokeStyle = '#eee', _.strokeWidth = 4.0 / d, _.globalAlpha = 1.0 / d /re[_ > 1 ? 1 : _ < 0 ? 0 : _],
                                                 let[v1 = project(v1)] in _.moveTo(v1.x, v1.y), let[v2 = project(v2)] in _.lineTo(v2.x, v2.y), where[d = depth(v1, v2)]],

               _.draw_cursor() = _ /se[seq[cursor_offset *!o[_.line(cursor, cursor.plus(o)), _.line(cursor, cursor.plus(o, -1))]]],
               _.repaint()     = _ /se[_.clear(), seq[lines *!l[_.line(l.v1, l.v2)]], _.draw_cursor()],

//   Viewport geometry.
//   The canvas is considered to be at z = 0, which is 300 units away from the viewport. This gives a view angle of about 45 degrees on a small screen, and closer to 60 degrees on a large screen.
//   Reverse-projection is basically the ray-tracing algorithm; we need to find the UV coordinates of the intersection with the plane. The math is fairly simple. We can project the viewport into
//   the plane, then project the viewport-screen ray, and then multiply by the factor required to reach the plane. This gives us surface coordinates.

//   Distance between the plane and a point is also simple. We just need to project the vector between a point on the plane and the point in question onto the plane's normal vector. That new
//   vector's length is the distance. (We can omit the normal vector measurement since we know it's a unit vector anyway.)

               l*[plane_distance(v)  = v.plus(plane.normal.times(plane.d), -1).dot(plane.normal),
                  intersection(x, y) = l*[d = plane_distance(viewport), direction = view_at(x, y).plus(viewport, -1), dn = direction.dot(plane.normal)] in
                                       viewport.plus(direction, plane.d / dn)] in

               _ /se[_.mousemove(_) /cps.e[draw([{v1: cursor, v2: v}]), when[down], cursor = v, repaint(), where[v = intersection(e.pageX, e.pageY)]],
                     _.mousedown(_) /cps.e[down = true],
                     _.mouseup(_)   /cps.e[down = false],
                     where[down = false]],

               where*[project(v)    = {x: (v.x - viewport.x) / (v.z - viewport.z), y: (v.y - viewport.y) / (v.z - viewport.z)},
                      depth(v1, v2) = viewport.z - (v1.z + v2.z) / 2.0,
                      view_at(x, y) = new caterwaul.vector(x, y, 0),
                      drawing       = 'test',
                      lines         = seq[~[]],
                      cursor        = new caterwaul.vector(0, 0, 0),
                      cursor_offset = seq[~[new caterwaul.vector(4, 0, 0), new caterwaul.vector(0, 4, 0), new caterwaul.vector(0, 0, 4)]],

                      v             = new caterwaul.vector(0, 1, 0),

                      listen()      = rpc.listen(drawing, lines.length, _) /cps.ls[seq[~ls *!+(lines/mb/push)], screen.repaint(), listen()],
                      draw(ls)      = rpc.draw(drawing, ls),

                      plane         = {normal: new caterwaul.vector(-0.8, 0.04, 0.4).unit(), d: 10} /se[_.flip() = _.normal = _.normal /re[new caterwaul.vector(-_.z, _.y, _.x)]],
                      viewport      = new caterwaul.vector(0, 0, -300)]]});

// Generated by SDoc 