// 后端API主入口
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { prompt } = await req.json();
    
    // 调用派欧云API
    const response = await fetch('https://api.ppinfra.com/v3/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3-0324',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的HTML代码生成器，会尽力理解用户的需求，根据用户需求生成完整、可直接运行的HTML代码，你生成的代码需要遵循以下要求：\n1.生成的代码以适配手机界面为首要目标\n2.在用户没有明确要求风格和配色的情况下，优先使用低饱和度的马卡龙色系，清新风格'
          },
          {
            role: 'user',
            content: `根据以下需求生成一个完整的HTML文件代码：${prompt}`
          }
        ]
      })
    });

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;
    
    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '生成代码时出错' },
      { status: 500 }
    );
  }
}