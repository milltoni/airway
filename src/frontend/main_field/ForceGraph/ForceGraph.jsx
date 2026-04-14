import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { setChosenInstances, setHoveredInstances } from "../../../store/slices/graphSlice"; // путь к вашему slice
//import "./forceGraph.css";

const ForceGraph = ({ graphData }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const edgesRef = useRef(null);
  const verticesRef = useRef(null);
  
  const dispatch = useDispatch();
  const chosenInstances = useSelector((state) => state.graph.chosenInstances);
  const hoveredInstances = useSelector((state) => state.graph.hoveredInstances);

  /*// Вспомогательные функции
  const instancePathByIndex = useCallback((index) => {
    const node = graphData?.nodes?.find(n => n.index === index);
    return node ? node.name : null;
  }, [graphData]);

  const instanceIndicesByPaths = useCallback((paths) => {
    return paths
      .filter(path => graphData?.nodes?.some(n => n.name === path))
      .map(path => graphData.nodes.find(n => n.name === path).index);
  }, [graphData]);

  // ВАШИ КАСТОМНЫЕ ФУНКЦИИ ПРИ НАВЕДЕНИИ
  const handleVertexHover = useCallback((vertexData) => {
    // Ваша логика при наведении на вершину
    console.log("Наведено на вершину:", vertexData);
    // Например: показать информацию в тултипе, загрузить данные и т.д.
    
    dispatch(setHoveredInstances([vertexData.name]));
  }, [dispatch]);

  const handleVertexLeave = useCallback((vertexData) => {
    // Ваша логика когда убрали курсор с вершины
    console.log("Курсор убран с вершины:", vertexData);
    
    dispatch(setHoveredInstances([]));
  }, [dispatch]);

  const handleVertexClick = useCallback((vertexData) => {
    // Ваша логика при клике на вершину
    console.log("Клик по вершине:", vertexData);
    
    dispatch(setChosenInstances([vertexData.name]));
  }, [dispatch]);

  const handleEdgeHover = useCallback((edgeData) => {
    // Ваша логика при наведении на ребро
    console.log("Наведено на ребро:", edgeData);
    console.log("Тип связи:", edgeData.type);
    console.log("От:", edgeData.source.name, "До:", edgeData.target.name);
    
    dispatch(setHoveredInstances([
      edgeData.source.name,
      edgeData.target.name
    ]));
  }, [dispatch]);

  const handleEdgeLeave = useCallback((edgeData) => {
    // Ваша логика когда убрали курсор с ребра
    console.log("Курсор убран с ребра:", edgeData);
    
    dispatch(setHoveredInstances([]));
  }, [dispatch]);

  const handleEdgeClick = useCallback((edgeData) => {
    // Ваша логика при клике на ребро
    console.log("Клик по ребру:", edgeData);
    
    dispatch(setChosenInstances([
      edgeData.source.name,
      edgeData.target.name
    ]));
  }, [dispatch]);*/

  // Drag функция
  const drag = useCallback(() => {
    return d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }, []);

  // Инициализация графа
  useEffect(() => {
    if (!graphData || !graphData.nodes) return;

    const width = 800;
    const height = 600;
    
    // Очистка
    d3.select(svgRef.current).selectAll("*").remove();
    
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    
    // Подготовка данных
    const nodes = graphData.groups.map(n => ({ ...n }));
    const links = graphData.links.map(l => ({ 
      ...l,
      source: typeof l.source === 'object' ? l.source : nodes.find(n => n.index === l.source),
      target: typeof l.target === 'object' ? l.target : nodes.find(n => n.index === l.target)
    }));
    
    const types = [...new Set(links.map(l => l.type))];
    const color = d3.scaleOrdinal(types, d3.schemeCategory10);
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("max-width", "100%")
      .style("height", "auto");
    
    const container = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    // Маркеры для стрелок
    const defs = svg.append("defs");
    types.forEach(type => {
      defs.append("marker")
        .attr("id", `arrow-${type.replace(/\s/g, '')}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", -0.5)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color(type))
        .attr("d", "M0,-5L10,0L0,5");
    });
    
    // Симуляция
    simulationRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.index).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(0, 0));
    
    // Группы для ребер и вершин
    const edgeGroup = container.append("g").attr("class", "edges-group");
    const vertexGroup = container.append("g").attr("class", "vertices-group");
    
    // Прямые линии
    const linkLine = (d) => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
    
    // Отрисовка ребер (без стилей наведения)
    const edges = edgeGroup
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", d => color(d.type))
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke-opacity", 0.7) // постоянная прозрачность
      .attr("marker-end", d => `url(#arrow-${d.type.replace(/\s/g, '')})`);
    
    edgesRef.current = edges;
    
    // Обработчики для ребер с ВАШИМИ кастомными функциями
    /*edges.on("mouseover", (event, d) => {
      handleEdgeHover(d);
    }).on("mouseout", (event, d) => {
      handleEdgeLeave(d);
    }).on("click", (event, d) => {
      handleEdgeClick(d);
    });*/
    
    // Отрисовка вершин (без стилей наведения)
    const vertices = vertexGroup
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag());
    
    // Постоянный стиль вершин (не меняется при наведении)
    vertices.append("circle")
      .attr("r", 6)
      .attr("fill", "#4a90e2")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    vertices.append("text")
      .attr("x", 12)
      .attr("y", "0.35em")
      .text(d => d.name)
      .style("font-size", "11px")
      .style("fill", "#333")
      .style("font-weight", "normal");
    
    verticesRef.current = vertices;
    
    // Обработчики для вершин с ВАШИМИ кастомными функциями
    /*vertices.on("mouseover", (event, d) => {
      handleVertexHover(d);
    }).on("mouseout", (event, d) => {
      handleVertexLeave(d);
    }).on("click", (event, d) => {
      handleVertexClick(d);
    });*/
    
    // Анимация
    simulationRef.current.on("tick", () => {
      edges.attr("d", linkLine);
      vertices.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, drag/*, handleVertexHover, handleVertexLeave, handleVertexClick, handleEdgeHover, handleEdgeLeave, handleEdgeClick*/]);

  if (!graphData || !graphData.nodes) {
    return <div>Loading graph data...</div>;
  }

  return (
    <div className="force-graph-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ForceGraph;