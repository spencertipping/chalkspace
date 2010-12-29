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
    $.fn.gc() = this[0].getContext('2d');

    l*[b = $('body'), screen = html[canvas] /se[b.append(_)], backing = html[canvas /hide()] /se[b.append(_)], rpc = caterwaul.montenegro.rpc /re[{listen: _('/listen'), draw: _('/draw')}]] in
    screen /se[$(window).resize(_) /cps.e[_[0].width = backing[0].width = w.width(), _[0].height = backing[0].height = w.height(), where[w = $(window)], _.redraw_lines(), _.repaint()],

               $.fn.line(v1, v2, o) = this.gc() /se[_.strokeStyle = '#eee', _.strokeWidth = 2.0 / d, _.globalAlpha = (o || 1.0) / d /re[_ > 1 ? 1 : _ < 0 ? 0 : _], _.beginPath(),
                                                    project(v1) /se.v[_.moveTo(v.x, v.y)], project(v2) /se.v[_.lineTo(v.x, v.y)], _.stroke(), _.closePath(), where[d = depth(v1, v2)]],

               _.clear()        = _.gc()       /se[_.globalAlpha = 1.0, _.drawImage(backing[0], 0, 0)],
               _.redraw_lines() = backing.gc() /se[_.fillStyle = '#10181c', _.globalAlpha = 1.0, _.fillRect(0, 0, backing[0].width, backing[0].height),
                                                   seq[lines *!l[backing.line(l.v1, l.v2)]]],

               _.draw_cursor()  = _ /se[_.line(cursor, cursor.plus(up, 8), 0.5), _.line(cursor, cursor.plus(up.cross(plane.normal), 8), 0.5)],
               _.repaint()      = _ /se[_.clear(), _.draw_cursor()],

//   Viewport geometry.
//   The canvas is considered to be at z = 0, which is 300 units away from the viewport. This gives a view angle of about 45 degrees on a small screen, and closer to 60 degrees on a large screen.
//   Reverse-projection is basically the ray-tracing algorithm; we need to find the coordinates of the intersection with the plane. The math is fairly simple. We can dot the viewport-screen ray
//   against the plane normal vector to find the intersection distance. Then we just project the ray by that amount. (This follows because the normal vector is normalized.)

//   Distance between the plane and a point is also simple. We just need to project the vector between a point on the plane and the point in question onto the plane's normal vector. That new
//   vector's length is the distance. (We can omit the normal vector measurement since we know it's a unit vector anyway.)

               l*[plane_distance(v)  = v.plus(plane.normal.times(plane.d), -1).dot(plane.normal),
                  intersection(x, y) = l*[d = plane_distance(viewport), direction = view_at(x, y).plus(viewport, -1), dn = direction.dot(plane.normal)] in
                                       viewport.plus(direction, plane.d / dn)] in

               _ /se[_.mousemove(_) /cps.e[shift_down ? viewport /se[_.x += e.pageX - down.x, _.y += e.pageY - down.y, down.x = e.pageX, down.y = e.pageY] :
                                                        draw([{v1: cursor, v2: v}]), when[down],
                                           cursor = v, _.redraw_lines(), _.repaint(), where[v = intersection(e.pageX + viewport.x - _.width() / 2, e.pageY + viewport.y - _.height() / 2)]],

                     _.mousedown(_) /cps.e[down = {x: e.pageX, y: e.pageY}],
                     _.mouseup(_)   /cps.e[down = false],

                     $(document).keydown(_) /cps.e[shift_down = e.which === 16, e.which === 32 && plane.flip() /se[screen.repaint()]],
                     $(document).keyup(_)   /cps.e[shift_down = false],

                     where[down = false, shift_down = false]],

               $(window).resize(), listen(),
               where*[project(v)    = l[z = (v.z - viewport.z) / -viewport.z] in {x: (v.x - viewport.x) / z + _.width() / 2, y: (v.y - viewport.y) / z + _.height() / 2},
                      depth(v1, v2) = ((v1.z + v2.z) / 2.0 - viewport.z) / -viewport.z,
                      view_at(x, y) = new caterwaul.vector(x, y, 0),
                      drawing       = 'test',
                      lines         = seq[~[]],
                      cursor        = new caterwaul.vector(0, 0, 0),
                      up            = new caterwaul.vector(0, 1, 0),

                      listen()      = rpc.listen(drawing, lines.length, _) /cps.ls[seq[~ls *![lines.push(_)]], _.redraw_lines(), _.repaint(), listen()],
                      draw(ls)      = rpc.draw(drawing, ls),

                      plane         = {normal: new caterwaul.vector(-0.2, 0, 0.4).unit(), d: 300} /se[_.flip() = _.normal = _.normal /re[new caterwaul.vector(_.z, _.y, _.x)]],
                      viewport      = new caterwaul.vector(0, 0, -300)]]}));

// Generated by SDoc 
