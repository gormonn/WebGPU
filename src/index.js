// https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html

async function main() {
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) {
    console.error("need a browser that supports WebGPU!"); // todo fail? wtf?
    return;
  }

  const canvas = document.getElementById("root");
  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format,
  });

  const module = device.createShaderModule({
    label: "Hardcoded red triangle shaders",
    code: `
        @vertex fn vertexShader(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
            let pos = array(
                vec2f( 0.0,  0.5), // сверху по центру
                vec2f(-0.5, -0.5), // Нижний левый
                vec2f( 0.5, -0.5)  // Нижний правый 
            );
            // let pos = array(
            //     vec2f( 0.0,  0.0),
            //     vec2f( 0.0,  1),
            //     vec2f( 1, 1),
            //     vec2f( 1,  0)
            // );

            return vec4f(pos[vertexIndex], 0.0, 1.0);
        }

        @fragment fn fragmentShader() -> @location(0) vec4f {
            return vec4f(1.0, 0.0, 0.0, 1.0);
        }
    `,
  });

  const pipeline = device.createRenderPipeline({
    label: "Hardcoded red triangle pipeline",
    layout: "auto",
    vertex: {
      module,
      entryPoint: "vertexShader",
    },
    fragment: {
      module,
      entryPoint: "fragmentShader",
      targets: [{ format }],
    },
  });

  const renderPassDescriptor = {
    label: "Basic canvas renderPass",
    colorAttachments: [
      {
        clearValue: [0.3, 0.3, 0.3, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  function render() {
    // Получаем текущую текстуру из контекста холста и
    // устанавливаем его в качестве текстуры для рендеринга.
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    // создаем кодировщик команд, чтобы начать кодировать команды
    const encoder = device.createCommandEncoder({ label: "Our Encoder" });

    // создаем кодировщик прохода рендеринга для кодирования конкретных команд рендеринга
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  }

  render();
}

main();
