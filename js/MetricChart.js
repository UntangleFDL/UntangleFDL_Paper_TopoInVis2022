

let layout_col_scheme = { random: "#666666",
                          layered_layout: "#1b9e77",
                          radial_layout: "#7570b3" }

function MetricChart(dest_svg, field, x_range, y_range ) {

    let margin = {left: 40, right: 7, top: 5, bottom: 30};
    let convWidth = $('#'+dest_svg).width();
    let convHeight = $('#'+dest_svg).height();

    let convSvg = d3.select('#'+dest_svg)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3.scaleLinear()
        .domain(x_range)
        .range([0, (convWidth - margin.left - margin.right)]);

    let y = d3.scaleLinear()
        .domain(y_range)
        .range([(convHeight - margin.top - margin.bottom), 0]);

    let lineFunc = d3.line()
        .x(function (d, i) {
            return x(i);
        })
        .y(function (d, i) {
            return y(d);
        })



    let label_box_drag = () => {
        function dragstarted(d) {
            d.dx = d3.event.x-d.x
            d.dy = d3.event.y-d.y
        }

        function dragged(d){
            d.x=d3.event.x+d.dx
            d.y=d3.event.y+d.dy
            d.update_layout(d)
        }

        function dragended(d) { }

        return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
    }


    convSvg.append('g')
        .call(d3.axisLeft(y))
            .append("text")
                .attr("class","axis y_axis")
                .attr('y', -39)
                .attr('dy', "0.91em")
                .text( get_proper_name(field) );

    convSvg.append('g')
        .attr('transform', 'translate(0,' + (convHeight-margin.bottom-margin.top) + ')')
        .call(d3.axisBottom(x).ticks(7))
            .append("text")
                .attr("class","axis x_axis")
                .attr('transform', 'translate(' + (convWidth-margin.left-margin.right) + ',' + (margin.bottom) + ')')
                .attr("y", -2)
                .attr("dy", 0 ) //"0.71em")
                .text("Number of iterations");


    let label_box_drag_handler = label_box_drag()


    function generate_label_box( layout, data, idx ){

        let datum = {x:45+15*idx, y:70+25*idx, dx:0, dy:0, w: 95, h: 20, data: data, update_layout: (d)=>{
                        d.rect.attr("x", d.x).attr("y", d.y)
                              .attr( "width", d.w = 40 + d.text.text().length*5.2 )
                        d.text.attr( "x", d.x+d.w/2 ).attr( "y", d.y+d.h/2+5 )

                        let idx = d3.minIndex( d.data, (p,i)=>{
                                    if(x(i)>d.x ) return null
                                    let dx = Math.abs(x(i) - d.x)
                                    let dy = Math.abs(y(p) - d.y)
                                    if( Math.abs( y(p) - d.y ) > Math.abs( y(p) - (d.y+d.h) ) )
                                        dy = Math.abs(y(p) - (d.y + d.h))
                                    return (dx*dx+dy*dy)*Math.max(10,Math.abs(dx-dy))
                                } )
                        if( Math.abs( y(d.data[idx]) - d.y ) > Math.abs( y(d.data[idx]) - (d.y+d.h) ) ){
                            d.line.attr("x1", d.x).attr("y1", d.y + d.h)
                                  .attr("x2", x(idx)).attr("y2", y(d.data[idx]))
                        }
                        else{
                            d.line.attr("x1", d.x).attr("y1", d.y)
                                  .attr("x2", x(idx)).attr("y2", y(d.data[idx]))
                        }
            }}

        let g = convSvg.append('g')
                        .attr("class", "label_box")
                        .datum(datum)

        datum.rect = g.append("rect")
                        .attr("class", "label_rect")
                        .attr("x", d=>d.x )
                        .attr("y", d=>d.y )
                        .attr("height", d=>d.h)
                        .attr("width", d=>d.w)
                        .attr("stroke", layout_col_scheme[layout])

        datum.line = g.append("line")
                        .attr( "x1", 100 ).attr( "y1", 100 )
                        .attr( "x2", 200 ).attr( "y2", 200 )
                        .attr( "stroke", layout_col_scheme[layout] )
                        .attr( "stroke-width", 2 )

        datum.text = g.append("text")
                        .attr("class", "label_text")
                        .attr("x", 50)
                        .attr("y", 50)
                        .text( get_proper_name(layout) )

        datum.update_layout(datum)

        label_box_drag_handler(g);

    }

    let idx = 0

        function add_data( layout, data ){
                generate_label_box(layout, data, idx)

                let group = convSvg.append('g')

                group.append('path')
                    .attr("fill", "none")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-width", 2)
                    .attr("stroke", layout_col_scheme[layout] )
                    .attr('d', lineFunc(data))

                convSvg.selectAll(".label_box").moveToFront()
            idx++
        }

    return {
        add_data : function(layout, data){
            add_data(layout,data)
            return this
        }
    }

}


